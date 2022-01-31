"use strict";
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
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Imports.
 */
/** @jsx jsx */
var react_1 = require("@emotion/react");
var header_1 = require("./header");
var signInAndUp_1 = __importDefault(require("../../../../passwordless/components/features/signInAndUp"));
var passwordlessForm_1 = __importDefault(require("./passwordlessForm"));
var thirdPartyOnlySignInUp_1 = require("./thirdPartyOnlySignInUp");
var headerWithProviderList_1 = require("./headerWithProviderList");
exports.SignInUpTheme = function (props) {
    if (!props.passwordlessRecipe) {
        if (!props.thirdPartyRecipe) {
            // This should never happen
            throw new Error("No recipes to show");
        }
        return react_1.jsx(
            thirdPartyOnlySignInUp_1.ThirdPartyOnlySignInUpWrapper,
            __assign({}, props, { thirdPartyRecipe: props.thirdPartyRecipe })
        );
    }
    return react_1.jsx(
        signInAndUp_1.default,
        { recipe: props.passwordlessRecipe, history: props.history, isEmbedded: true },
        react_1.jsx(
            passwordlessForm_1.default,
            // Seed props. Real props will be given by parent feature.
            __assign(
                {},
                {},
                {
                    header:
                        props.thirdPartyRecipe === undefined
                            ? react_1.jsx(header_1.Header, null)
                            : react_1.jsx(headerWithProviderList_1.HeaderWithProviderList, __assign({}, props)),
                }
            )
        )
    );
};