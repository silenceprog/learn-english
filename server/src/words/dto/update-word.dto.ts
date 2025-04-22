import { PartialType } from "@nestjs/swagger";
import { CreateWordDto } from "./create-word.dto";

export class UpdateWordDTO extends PartialType(CreateWordDto){}