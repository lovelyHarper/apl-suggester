/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

'use strict';

import { IValidationInfo, NotificationLevel } from '../../IValidationInfo';
import { Seed } from '../ValidationSeed';

/**
 * Validaiton Rule to parse out relative value.
 * @export
 * @class NotRelativeRule
 */
export class NotRelativeRule {
    /**
     * Entrance method to apply the rule.
     * @param sourceObject object to parse.
     * @param key key to parse.
     * @param collectors used to collect all validation info.
     */
    public static applyRule(
        sourceObject : Seed,
        key : string,
        collectors : IValidationInfo[],
        context? : string,
        overrideMessage? : string) : void {
        const valueToCheck = sourceObject.getValue(key);
        if (!valueToCheck || typeof(valueToCheck) === 'number'
        // todo: Remove after evaluation is implemented
        || valueToCheck.startsWith('@') || valueToCheck.startsWith('$')) {
            return;
        }
        const regexp = new RegExp('.*\.%$');
        if (regexp.test(valueToCheck)) {
            const finalErrorContext = context ? context : `${sourceObject.getValue('type')}`;
            const finalMessage =
            overrideMessage ? overrideMessage : `${finalErrorContext} should be an absolute or auto value.`;
            collectors.push({
                path : `${sourceObject.getJsonPath()}/${key}`,
                errorMessage : finalMessage,
                level : NotificationLevel.WARN
            });
        }
    }
}