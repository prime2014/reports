import { IsEmail, IsString, IsNotEmpty } from "class-validator";


export class EmailSubscribeDto {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string
}
