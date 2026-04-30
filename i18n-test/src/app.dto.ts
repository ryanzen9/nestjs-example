import { IsNotEmpty } from "class-validator";

export class AppDto {
    @IsNotEmpty({
        message: 'validate.usernameNotEmpty'
    })
    name: string;
}
