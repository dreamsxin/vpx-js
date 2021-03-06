/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import { expect } from 'chai';
import { Grammar } from '../grammar/grammar';
import { Transformer } from '../transformer/transformer';

let grammar: Grammar;

before(async () => {
	grammar = new Grammar();
});

describe('The VBScript transpiler - Array', () => {
	it('should transpile a one-dimension redim', () => {
		const vbs = `Redim myarray(2)`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`myarray = ${Transformer.VBSHELPER_NAME}.redim(myarray, [2]);`);
	});

	it('should transpile a one-dimension redim with preserve', () => {
		const vbs = `Redim Preserve myarray(2)`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`myarray = ${Transformer.VBSHELPER_NAME}.redim(myarray, [2], true);`);
	});

	it('should transpile a multi-dimension redim', () => {
		const vbs = `Redim myarray(2,4,3)`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`myarray = ${Transformer.VBSHELPER_NAME}.redim(myarray, [\n    2,\n    4,\n    3\n]);`);
	});

	it('should transpile a multi-dimension redim with preserve', () => {
		const vbs = `Redim Preserve myarray(2,4,3)`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(
			`myarray = ${Transformer.VBSHELPER_NAME}.redim(myarray, [\n    2,\n    4,\n    3\n], true);`,
		);
	});

	it('should transpile a redim with multiple arrays', () => {
		const vbs = `Redim myarray(2,4,3), myarray2(100)`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(
			`myarray = ${Transformer.VBSHELPER_NAME}.redim(myarray, [\n    2,\n    4,\n    3\n]);\nmyarray2 = ${Transformer.VBSHELPER_NAME}.redim(myarray2, [100]);`,
		);
	});

	it('should transpile a redim with multiple arrays and preserve', () => {
		const vbs = `Redim Preserve myarray(2,4,3), myarray2(100)`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(
			`myarray = ${Transformer.VBSHELPER_NAME}.redim(myarray, [\n    2,\n    4,\n    3\n], true);\nmyarray2 = ${Transformer.VBSHELPER_NAME}.redim(myarray2, [100], true);`,
		);
	});

	it('should transpile an erase with a single array', () => {
		const vbs = `Erase myarray`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`myarray = ${Transformer.VBSHELPER_NAME}.erase(myarray);`);
	});

	it('should transpile an erase with multiple arrays', () => {
		const vbs = `Erase myarray, myarray2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(
			`myarray = ${Transformer.VBSHELPER_NAME}.erase(myarray);\nmyarray2 = ${Transformer.VBSHELPER_NAME}.erase(myarray2);`,
		);
	});
});
