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

describe('The VBScript transpiler - Expressions', () => {
	it('should transpile a "Eqv" expression', () => {
		const vbs = `EnableBallControl = 10 Eqv 8`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = ~(10 ^ 8);');
	});

	it('should transpile a "Xor" expression', () => {
		const vbs = `EnableBallControl = 10 Xor 8`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = 10 && !8 || !10 && 8;');
	});

	it('should transpile a "Or" expression', () => {
		const vbs = `If test = 5 Or Err Then test = 6`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`if (${Transformer.VBSHELPER_NAME}.equals(test, 5) || Err) {\n    test = 6;\n}`);
	});

	it('should transpile a "And" expression', () => {
		const vbs = `If test = 5 And Err Then test = 6`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`if (${Transformer.VBSHELPER_NAME}.equals(test, 5) && Err) {\n    test = 6;\n}`);
	});

	it('should transpile a "Not" expression', () => {
		const vbs = `EnableBallControl = Not EnableBallControl`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = !EnableBallControl;');
	});

	it('should transpile a "+" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl + 1`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl + 1;');
	});

	it('should transpile a "-" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl - 1`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl - 1;');
	});

	it('should transpile a "Mod" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl Mod 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl % 2;');
	});

	it('should transpile a "\\" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl \\ 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = ${Transformer.VBSHELPER_NAME}.intDiv(EnableBallControl, 2);`);
	});

	it('should transpile a "*" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl * 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl * 2;');
	});

	it('should transpile a "*" unary expression', () => {
		const vbs = `EnableBallControl = EnableBallControl * -2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl * -2;');
	});

	it('should transpile a "/" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl / 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl / 2;');
	});

	it('should transpile a "^" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl ^ 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = ${Transformer.VBSHELPER_NAME}.exponent(EnableBallControl, 2);`);
	});

	it('should transpile a "&" concat expression', () => {
		const vbs = `EnableBallControl = "ENABLE" & "OFF"`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal("EnableBallControl = 'ENABLE' + 'OFF';");
	});

	it('should transpile a "Is" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl Is 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = ${Transformer.VBSHELPER_NAME}.is(EnableBallControl, 2);`);
	});

	it('should transpile a ">=" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl >= 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl >= 2;');
	});

	it('should transpile a "=>" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl => 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl >= 2;');
	});

	it('should transpile a "<=" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl <= 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl <= 2;');
	});

	it('should transpile a "=<" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl =< 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl <= 2;');
	});

	it('should transpile a ">" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl > 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl > 2;');
	});

	it('should transpile a "<" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl < 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl < 2;');
	});

	it('should transpile a "<>" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl <> 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = !${Transformer.VBSHELPER_NAME}.equals(EnableBallControl, 2);`);
	});

	it('should transpile a "><" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl >< 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = !${Transformer.VBSHELPER_NAME}.equals(EnableBallControl, 2);`);
	});

	it('should transpile a "=" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl = 2`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = ${Transformer.VBSHELPER_NAME}.equals(EnableBallControl, 2);`);
	});

	it('should transpile a "Me" expression', () => {
		const vbs = `EnableBallControl = Me`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`EnableBallControl = this;`);
	});
});
