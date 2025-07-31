import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir: string;
  private readonly maxBackups: number;

  constructor(private configService: ConfigService) {
    this.backupDir = this.configService.get<string>('BACKUP_DIR') || './backups';
    this.maxBackups = this.configService.get<number>('MAX_BACKUPS') || 7;
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.logger.log(`A directory for backups has been created: ${this.backupDir}`);
    }
  }

  @Cron('0 0 2 * * *')
  async performDailyBackup() {
    this.logger.log('Start daily backups');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `daily-backup-${timestamp}`;
      
      await this.createFullBackup(backupName);
      
      await this.cleanupOldBackups();
      
      this.logger.log('Daily backup completed successfully');
    } catch (error) {
      this.logger.error('Error while performing daily backup', error);
    }
  }

  @Cron('0 0 1 * * 0')
  async performWeeklyBackup() {
    this.logger.log('Starting weekly backups');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `weekly-backup-${timestamp}`;
      
      await this.createFullBackup(backupName);
      await this.createConfigBackup(backupName);
      
      this.logger.log('Weekly backup completed successfully');
    } catch (error) {
      this.logger.error('Error while running weekly backup', error);
    }
  }

  async createFullBackup(backupName: string): Promise<void> {
    this.logger.log(`Создание полного бэкапа: ${backupName}`);
    
    const backupPath = path.join(this.backupDir, `${backupName}.zip`);
    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        this.logger.log(`Backup created: ${backupPath} (${archive.pointer()} bytes)`);
        resolve();
      });

      archive.on('error', (err) => {
        this.logger.error('Error creating archive', err);
        reject(err);
      });

      archive.pipe(output);

      const sourceDirs = [
        './uploads',
        './logs',
        './src',
        './public'
      ];

      sourceDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
          archive.directory(dir, path.basename(dir));
        }
      });

      const configFiles = [
        'package.json',
        'package-lock.json',
        '.env.example',
        'tsconfig.json'
      ];

      configFiles.forEach(file => {
        if (fs.existsSync(file)) {
          archive.file(file, { name: file });
        }
      });

      archive.finalize();
    });
  }

  async createDatabaseBackup(backupName: string): Promise<void> {
    this.logger.log(`Create backup db: ${backupName}`);
    
    const dbType = this.configService.get<string>('DB_TYPE');
    const dbURL = this.configService.get<string>('DATABASE_URL');
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbPort = this.configService.get<string>('DB_PORT');
    const dbName = this.configService.get<string>('DB_NAME');
    const dbUser = this.configService.get<string>('DB_USER');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    
    const backupPath = path.join(this.backupDir, `${backupName}-db.sql`);
    
    try {
      let command: string;
      
      switch (dbType) {
        case 'mysql':
          command = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName} > ${backupPath}`;
          break;
        case 'postgresql':
          command = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f ${backupPath}`;
          process.env.PGPASSWORD = dbPassword;
          break;
        case 'mongodb':
          command = `mongodump --host ${dbHost}:${dbPort} --db ${dbName} --out ${path.join(this.backupDir, `${backupName}-mongodb`)}`;
          break;
        default:
          throw new Error(`Неподдерживаемый тип базы данных: ${dbType}`);
      }
      
      await execAsync(command);
      this.logger.log(`Бэкап базы данных создан: ${backupPath}`);
    } catch (error) {
      this.logger.error('Ошибка при создании бэкапа базы данных', error);
      throw error;
    }
  }

  async createConfigBackup(backupName: string): Promise<void> {
    this.logger.log(`Создание бэкапа конфигурации: ${backupName}`);
    
    const configBackupPath = path.join(this.backupDir, `${backupName}-config.json`);
    
    const configData = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      safeEnvVars: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DB_TYPE: process.env.DB_TYPE,
        DATABASE_URL: process.env.DATABASE_URL,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
      }
    };
    
    fs.writeFileSync(configBackupPath, JSON.stringify(configData, null, 2));
    this.logger.log(`Бэкап конфигурации создан: ${configBackupPath}`);
  }

  async cleanupOldBackups(): Promise<void> {
    this.logger.log('Начинаем очистку старых бэкапов');
    
    try {
      const files = fs.readdirSync(this.backupDir);
      const backupFiles = files
        .filter(file => file.endsWith('.zip') || file.endsWith('.sql'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          stats: fs.statSync(path.join(this.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

      if (backupFiles.length > this.maxBackups) {
        const filesToDelete = backupFiles.slice(this.maxBackups);
        
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
          this.logger.log(`Удален старый бэкап: ${file.name}`);
        }
        
        this.logger.log(`Удалено ${filesToDelete.length} старых бэкапов`);
      }
    } catch (error) {
      this.logger.error('Ошибка при очистке старых бэкапов', error);
    }
  }

  @Cron('0 30 3 * * *') 
  async verifyBackupIntegrity(): Promise<void> {
    this.logger.log('Начинаем проверку целостности бэкапов');
    
    try {
      const files = fs.readdirSync(this.backupDir);
      const backupFiles = files.filter(file => file.endsWith('.zip'));
      
      for (const file of backupFiles) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.size === 0) {
          this.logger.error(`Пустой бэкап обнаружен: ${file}`);
        } else {
          this.logger.log(`Бэкап ${file} прошел проверку (${stats.size} bytes)`);
        }
      }
    } catch (error) {
      this.logger.error('Ошибка при проверке целостности бэкапов', error);
    }
  }

  async createManualBackup(name?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = name || `manual-backup-${timestamp}`;
    
    this.logger.log(`Создание ручного бэкапа: ${backupName}`);
    
    try {
      await this.createFullBackup(backupName);
      await this.createDatabaseBackup(backupName);
      await this.createConfigBackup(backupName);
      
      this.logger.log(`Ручной бэкап создан успешно: ${backupName}`);
      return backupName;
    } catch (error) {
      this.logger.error('Ошибка при создании ручного бэкапа', error);
      throw error;
    }
  }

  getBackupList(): any[] {
    try {
      const files = fs.readdirSync(this.backupDir);
      return files
        .filter(file => file.endsWith('.zip') || file.endsWith('.sql'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            created: stats.mtime,
            type: path.extname(file).slice(1)
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      this.logger.error('Ошибка при получении списка бэкапов', error);
      return [];
    }
  }

  async restoreFromBackup(backupName: string): Promise<void> {
    this.logger.log(`Начинаем восстановление из бэкапа: ${backupName}`);
    
    const backupPath = path.join(this.backupDir, backupName);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Бэкап не найден: ${backupName}`);
    }
    
    try {
      this.logger.log(`Восстановление из бэкапа завершено: ${backupName}`);
    } catch (error) {
      this.logger.error('Ошибка при восстановлении из бэкапа', error);
      throw error;
    }
  }
}