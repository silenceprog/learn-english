import { PartialType } from "@nestjs/swagger";
import { CreateVideoDto } from "./create-video.dto";

export class UpdateVideoDTO extends PartialType(CreateVideoDto){}