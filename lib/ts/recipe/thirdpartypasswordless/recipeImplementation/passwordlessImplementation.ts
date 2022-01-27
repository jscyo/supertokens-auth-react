import { RecipeInterface as TPPWlessRecipeInterface } from "..";
import { RecipeInterface as PasswordlessRecipeInterface } from "../../passwordless/types";

export default function getImpl(oI: TPPWlessRecipeInterface): PasswordlessRecipeInterface {
    return {
        clearLoginAttemptInfo: oI.clearLoginAttemptInfo.bind(oI),
        consumeCode: oI.consumeCode.bind(oI),
        createCode: oI.createCode.bind(oI),
        doesEmailExist: oI.doesEmailExist.bind(oI),
        doesPhoneNumberExist: oI.doesPhoneNumberExist.bind(oI),
        getLoginAttemptInfo: oI.getLoginAttemptInfo.bind(oI),
        resendCode: oI.resendCode.bind(oI),
        setLoginAttemptInfo: oI.setLoginAttemptInfo.bind(oI),
    };
}