/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
/*
 * Imports.
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { Fragment } from "react";
import { FeatureBaseProps } from "../../../../../types";
import FeatureWrapper from "../../../../../components/featureWrapper";
import Recipe from "../../../recipe";
import { ComponentOverrideContext } from "../../../../../components/componentOverride/componentOverrideContext";
import SignInUpTheme from "../../themes/signInUp";
import { defaultTranslationsThirdPartyPasswordless } from "../../themes/translations";
import {
    useChildProps as useThirdPartyChildProps,
    useFeatureReducer as useThirdPartyFeatureReducer,
} from "../../../../thirdparty/components/features/signInAndUp";
import {
    useChildProps as usePasswordlessChildProps,
    useFeatureReducer as usePasswordlessFeatureReducer,
    useSuccessInAnotherTabChecker,
} from "../../../../passwordless/components/features/signInAndUp";

import { ThirdPartySignInUpActions } from "../../../../thirdparty/types";
import { PasswordlessSignInUpAction } from "../../../../passwordless/types";

type PropType = FeatureBaseProps & {
    recipe: Recipe;
};

const SignInAndUp: React.FC<PropType> = (props) => {
    const [tpState, tpDispatch] = useThirdPartyFeatureReducer();
    const [pwlessState, pwlessDispatch] = usePasswordlessFeatureReducer(props.recipe.passwordlessRecipe?.recipeImpl);
    const [combinedState, dispatch] = React.useReducer(
        (state: { error: string | undefined }, action: ThirdPartySignInUpActions | PasswordlessSignInUpAction) => {
            switch (action.type) {
                case "setError":
                    return {
                        ...state,
                        error: action.error,
                    };
                default:
                    return state;
            }
        },
        { error: tpState.error || pwlessState.error }
    );

    const combinedTPDispatch = React.useCallback<typeof tpDispatch>(
        (action) => {
            dispatch(action);
            tpDispatch(action);
        },
        [tpDispatch, dispatch]
    );
    const tpChildProps = useThirdPartyChildProps(props.recipe.thirdPartyRecipe)!;

    const combinedPWLessDispatch = React.useCallback<typeof pwlessDispatch>(
        (action) => {
            dispatch(action);
            pwlessDispatch(action);
        },
        [pwlessDispatch, dispatch]
    );

    const callingConsumeCodeRef = useSuccessInAnotherTabChecker(pwlessState, combinedPWLessDispatch);

    const pwlessChildProps = usePasswordlessChildProps(
        props.recipe.passwordlessRecipe,
        combinedPWLessDispatch,
        pwlessState,
        callingConsumeCodeRef,
        props.history
    )!;

    const componentOverrides = props.recipe.config.override.components;
    const childProps = {
        passwordlessRecipe: props.recipe.passwordlessRecipe,
        thirdPartyRecipe: props.recipe.thirdPartyRecipe,
        config: props.recipe.config,
        history: props.history,
        commonState: combinedState,
        tpState,
        tpDispatch: combinedTPDispatch,
        tpChildProps,
        pwlessState,
        pwlessDispatch: combinedPWLessDispatch,
        pwlessChildProps,
    };

    return (
        <ComponentOverrideContext.Provider value={componentOverrides}>
            <FeatureWrapper
                useShadowDom={props.recipe.config.useShadowDom}
                defaultStore={defaultTranslationsThirdPartyPasswordless}>
                <Fragment>
                    {/* No custom theme, use default. */}
                    {props.children === undefined && <SignInUpTheme {...childProps} />}
                    {/* Otherwise, custom theme is provided, propagate props. */}
                    {props.children &&
                        React.Children.map(props.children, (child) => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child, props);
                            }

                            return child;
                        })}
                </Fragment>
            </FeatureWrapper>
        </ComponentOverrideContext.Provider>
    );
};

export default SignInAndUp;
