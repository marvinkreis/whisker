/*
 * Copyright (C) 2020 Whisker contributors
 *
 * This file is part of the Whisker test generator for Scratch.
 *
 * Whisker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Whisker is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Whisker. If not, see http://www.gnu.org/licenses/.
 *
 */

/* eslint-disable no-console */

import {TestGenerator} from "./testgenerator/TestGenerator";
import WhiskerUtil from "../test/whisker-util.js";
import {WhiskerTest} from "./testgenerator/WhiskerTest";
import {List} from "./utils/List";
import VirtualMachine from "scratch-vm/src/virtual-machine"
import {WhiskerSearchConfiguration} from "./utils/WhiskerSearchConfiguration";
import {Container} from "./utils/Container";
import {StatisticsCollector} from "./utils/StatisticsCollector";
import {Randomness} from "./utils/Randomness";
import {seedScratch} from "../util/random";
import {JavaScriptConverter} from "./testcase/JavaScriptConverter";
import {ScratchEventExtractor} from "./testcase/ScratchEventExtractor";

export class Search {

    public vm: VirtualMachine;

    constructor(vm: VirtualMachine) {
        this.vm = vm;
    }

    private async execute(project, config: WhiskerSearchConfiguration): Promise<List<WhiskerTest>> {
        console.log("Whisker-Main: test generation")

        const testGenerator: TestGenerator = config.getTestGenerator();
        return await testGenerator.generateTests(project);
    }

    private printTests(tests: List<WhiskerTest>): void {
        let i = 0;
        console.log("Total number of tests: "+tests.size());
        for (const test of tests) {
            console.log("Test "+i+": \n" + test.toString());
            i++;
        }
    }

    private testsToString(tests: List<WhiskerTest>): string {
        const converter = new JavaScriptConverter();
        return converter.getSuiteText(tests);
    }

    /*
     * Main entry point -- called from whisker-web
     */
    public async run(vm, project, configRaw: string, accelerationFactor: number): Promise<string> {
        console.log("Whisker-Main: Starting Search based algorithm");

        const util = new WhiskerUtil(vm, project);
        const configJson = JSON.parse(configRaw);
        const config = new WhiskerSearchConfiguration(configJson);

        Container.config = config;
        Container.vm = vm;
        Container.vmWrapper = util.getVMWrapper();
        Container.testDriver = util.getTestDriver({});
        Container.acceleration = accelerationFactor;
        ScratchEventExtractor.extractAvailableTextSnippets(this.vm);
        ScratchEventExtractor.extractAvailableDurations(this.vm);

        await util.prepare(accelerationFactor || 1);
        util.start();
        const seed = Date.now();
        Randomness.setInitialSeed(seed);
        seedScratch(String(seed));
        StatisticsCollector.getInstance().reset();
        const tests = await this.execute(project, config);
        this.printTests(tests);
        const csvString: string = StatisticsCollector.getInstance().asCsv();
        console.log(csvString);

        const javaScriptText = this.testsToString(tests);
        return javaScriptText;
    }
}
