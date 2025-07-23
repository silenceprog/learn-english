
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  password: 'password',
  role: 'role',
  avatar: 'avatar',
  isEmailVerified: 'isEmailVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deleteAt: 'deleteAt',
  lastLoginAt: 'lastLoginAt',
  provider: 'provider',
  refreshToken: 'refreshToken',
  totalXP: 'totalXP',
  currentStreak: 'currentStreak',
  longestStreak: 'longestStreak',
  totalLearningTime: 'totalLearningTime',
  lastActiveAt: 'lastActiveAt'
};

exports.Prisma.WordScalarFieldEnum = {
  id: 'id',
  text: 'text',
  language: 'language',
  translate: 'translate',
  definitions: 'definitions',
  synonyms: 'synonyms',
  antonyms: 'antonyms',
  examples: 'examples',
  partOfSpeech: 'partOfSpeech',
  createdAt: 'createdAt',
  totalProgress: 'totalProgress',
  isLearned: 'isLearned',
  phonetic: 'phonetic',
  audio: 'audio',
  phoneticUS: 'phoneticUS',
  audioUS: 'audioUS',
  userId: 'userId'
};

exports.Prisma.VideoScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  url: 'url',
  language: 'language',
  level: 'level',
  duration: 'duration',
  skillTypes: 'skillTypes',
  courseId: 'courseId',
  createdAt: 'createdAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  question: 'question',
  answer: 'answer',
  options: 'options',
  type: 'type',
  score: 'score',
  createdAt: 'createdAt',
  order: 'order',
  explanation: 'explanation',
  skillType: 'skillType',
  language: 'language',
  cefrLevel: 'cefrLevel',
  xpReward: 'xpReward',
  timeLimit: 'timeLimit',
  authorId: 'authorId',
  videoId: 'videoId',
  courseId: 'courseId'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  imageUrl: 'imageUrl',
  level: 'level',
  targetSkills: 'targetSkills',
  isPublished: 'isPublished',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tags: 'tags',
  estimatedHours: 'estimatedHours',
  totalXP: 'totalXP',
  authorId: 'authorId'
};

exports.Prisma.EnrollmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  progress: 'progress',
  enrolledAt: 'enrolledAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  global_language: 'global_language',
  current_language: 'current_language',
  purposes: 'purposes',
  current_level: 'current_level',
  dailyXPGoal: 'dailyXPGoal',
  dailyTimeGoal: 'dailyTimeGoal',
  weeklyGoal: 'weeklyGoal'
};

exports.Prisma.LanguageProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  language: 'language',
  overallCEFR: 'overallCEFR',
  overallProgress: 'overallProgress',
  totalXP: 'totalXP',
  totalTime: 'totalTime',
  lastActiveAt: 'lastActiveAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SkillProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  languageProgressId: 'languageProgressId',
  skillType: 'skillType',
  cefrLevel: 'cefrLevel',
  levelProgress: 'levelProgress',
  xpEarned: 'xpEarned',
  totalPracticed: 'totalPracticed',
  correctAnswers: 'correctAnswers',
  totalAnswers: 'totalAnswers',
  currentAccuracy: 'currentAccuracy',
  timeSpent: 'timeSpent',
  totalWordsStudied: 'totalWordsStudied',
  wordsLearned: 'wordsLearned',
  wordsReviewing: 'wordsReviewing',
  lastPracticed: 'lastPracticed',
  updatedAt: 'updatedAt'
};

exports.Prisma.SkillLevelRequirementsScalarFieldEnum = {
  id: 'id',
  skillType: 'skillType',
  cefrLevel: 'cefrLevel',
  minXP: 'minXP',
  minAccuracy: 'minAccuracy',
  minPracticed: 'minPracticed',
  minTimeSpent: 'minTimeSpent',
  minWordsLearned: 'minWordsLearned',
  weightInOverall: 'weightInOverall',
  displayName: 'displayName',
  description: 'description',
  color: 'color'
};

exports.Prisma.WordTaskProgressScalarFieldEnum = {
  id: 'id',
  wordId: 'wordId',
  userId: 'userId',
  skillType: 'skillType',
  isPassed: 'isPassed',
  score: 'score',
  attempts: 'attempts',
  correctCount: 'correctCount',
  nextReviewAt: 'nextReviewAt',
  reviewInterval: 'reviewInterval',
  easeFactor: 'easeFactor',
  lastAttempt: 'lastAttempt',
  timeSpent: 'timeSpent',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DailyStatsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  language: 'language',
  date: 'date',
  totalXP: 'totalXP',
  totalTime: 'totalTime',
  tasksCompleted: 'tasksCompleted',
  averageAccuracy: 'averageAccuracy',
  skillsStats: 'skillsStats',
  newWordsLearned: 'newWordsLearned',
  wordsReviewed: 'wordsReviewed'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  type: 'type',
  requiredSkill: 'requiredSkill',
  requiredLevel: 'requiredLevel',
  requiredOverall: 'requiredOverall',
  requiredXP: 'requiredXP',
  requiredStreak: 'requiredStreak',
  requiredAccuracy: 'requiredAccuracy',
  xpReward: 'xpReward',
  badge: 'badge',
  isActive: 'isActive'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  achievementId: 'achievementId',
  unlockedAt: 'unlockedAt',
  language: 'language'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  OWNER: 'OWNER',
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.Language = exports.$Enums.Language = {
  EN: 'EN',
  UA: 'UA',
  DE: 'DE'
};

exports.CEFRLevel = exports.$Enums.CEFRLevel = {
  PRE_A1: 'PRE_A1',
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2'
};

exports.CoreSkillType = exports.$Enums.CoreSkillType = {
  READING: 'READING',
  LISTENING: 'LISTENING',
  SPEAKING: 'SPEAKING',
  WRITING: 'WRITING',
  VOCABULARY: 'VOCABULARY'
};

exports.TaskType = exports.$Enums.TaskType = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK',
  TRUE_FALSE: 'TRUE_FALSE',
  DRAG_AND_DROP: 'DRAG_AND_DROP',
  AUDIO_CHOICE: 'AUDIO_CHOICE',
  SPEAKING: 'SPEAKING'
};

exports.Purpose = exports.$Enums.Purpose = {
  NONE: 'NONE',
  WORK: 'WORK',
  TRAVEL: 'TRAVEL',
  EDUCATION: 'EDUCATION',
  SELF_DEV: 'SELF_DEV',
  COMMUNICATION: 'COMMUNICATION',
  HOBBY: 'HOBBY'
};

exports.AchievementType = exports.$Enums.AchievementType = {
  SKILL_LEVEL: 'SKILL_LEVEL',
  OVERALL_LEVEL: 'OVERALL_LEVEL',
  XP_MILESTONE: 'XP_MILESTONE',
  STREAK_MASTER: 'STREAK_MASTER',
  ACCURACY_EXPERT: 'ACCURACY_EXPERT',
  VOCABULARY_GURU: 'VOCABULARY_GURU',
  PERFECTIONIST: 'PERFECTIONIST'
};

exports.Prisma.ModelName = {
  User: 'User',
  Word: 'Word',
  Video: 'Video',
  Task: 'Task',
  Course: 'Course',
  Enrollment: 'Enrollment',
  Setting: 'Setting',
  LanguageProgress: 'LanguageProgress',
  SkillProgress: 'SkillProgress',
  SkillLevelRequirements: 'SkillLevelRequirements',
  WordTaskProgress: 'WordTaskProgress',
  DailyStats: 'DailyStats',
  Achievement: 'Achievement',
  UserAchievement: 'UserAchievement'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
