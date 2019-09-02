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
import { vbsToJs } from '../../test/script.helper';

describe('The VBScript transpiler', () => {
	it('should transpile an Option Explicit', () => {
		const vbs = `Option Explicit\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal(';    /* Option Explicit */');
	});

	it('should transpile a single variable declaration', () => {
		const vbs = `Dim test1\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let test1;');
	});

	it('should transpile a multiple variable declaration', () => {
		const vbs = `Dim test1, test2, test3\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let test1, test2, test3;');
	});

	it('should transpile a single Const declaration', () => {
		const vbs = `Const pi = 3.14\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('const pi = 3.14;');
	});

	it('should transpile a multiple Const declaration', () => {
		const vbs = `Const test1 = 3.14, test2 = 4, test3 = "TEST", test4 = -5.2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('const test1 = 3.14, test2 = 4, test3 = \'TEST\', test4 = -5.2;');
	});

	it('should transpile a subcall statement without params', () => {
		const vbs = `BallRelease.CreateBall\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('BallRelease.CreateBall();');
	});

	it('should transpile a subcall statement with params', () => {
		const vbs = `BallRelease.KickBall 0, -2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('BallRelease.KickBall(0, -2);');
	});

	it('should transpile a sub declaration without params', () => {
		const vbs = `Sub BallRelease_Hit()\nBallRelease.CreateBall\nEnd Sub\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('function BallRelease_Hit() {\n    BallRelease.CreateBall();\n}');
	});

	it('should transpile a sub declaration with params', () => {
		const vbs = `Sub BallRelease_Hit(value1, value2, value3)\nBallRelease.CreateBall\nEnd Sub\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('function BallRelease_Hit(value1, value2, value3) {\n    BallRelease.CreateBall();\n}');
	});

	it ('should transpile an assignment statement', () => {
		const vbs = `EnableBallControl = 0\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = 0;');
	});

	it ('should transpile a "Eqv" expression', () => {
		const vbs = `EnableBallControl = 10 Eqv 8\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = ~(10 ^ 8);');
	});

	it ('should transpile a "Xor" expression', () => {
		const vbs = `EnableBallControl = 10 Xor 8\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = 10 ^ 8;');
	});

	it ('should transpile a "Or" expression', () => {
		const vbs = `EnableBallControl = 10 Or 8\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = 10 | 8;');
	});

	it ('should transpile a "And" expression', () => {
		const vbs = `EnableBallControl = 10 And 8\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = 10 & 8;');
	});

	it ('should transpile a "Not" expression', () => {
		const vbs = `EnableBallControl = Not 10\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = ~10;');
	});

	it ('should transpile a "+" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl + 1\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl + 1;');
	});

	it ('should transpile a "-" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl - 1\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl - 1;');
	});

	it ('should transpile a "Mod" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl Mod 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl % 2;');
	});

	it ('should transpile a "\\" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl \\ 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = Math.floor(Math.floor(EnableBallControl) / Math.floor(2));;');
	});

	it ('should transpile a "*" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl * 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl * 2;');
	});

	it ('should transpile a "/" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl / 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl / 2;');
	});

	it ('should transpile a "^" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl ^ 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = Math.pow(EnableBallControl, 2);;');
	});

	it ('should transpile a "Is" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl Is 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl == 2;');
	});

	it ('should transpile a "Is Not" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl Is Not 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl != 2;');
	});

	it ('should transpile a ">=" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl >= 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl >= 2;');
	});

	it ('should transpile a "=>" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl => 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl => 2;');
	});

	it ('should transpile a "<=" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl <= 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl <= 2;');
	});

	it ('should transpile a "=<" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl =< 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl =< 2;');
	});

	it ('should transpile a ">" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl > 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl > 2;');
	});

	it ('should transpile a "<" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl < 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl < 2;');
	});

	it ('should transpile a "<>" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl <> 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl != 2;');
	});

	it ('should transpile a "=" expression', () => {
		const vbs = `EnableBallControl = EnableBallControl = 2\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('EnableBallControl = EnableBallControl == 2;');
	});

	it ('should transpile an "If/Then" statement', () => {
		const vbs = `If EnableBallControl = 1 Then\nEnableBallControl = 0\nEnd If\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('if (EnableBallControl == 1) {\n    EnableBallControl = 0;\n}');
	});

	it ('should transpile an "If/Then...Else" statement', () => {
		const vbs = `If EnableBallControl = 1 Then\nEnableBallControl = 0\nEnableBallControl = 3\nElse\nEnableBallControl = 1\nEnableBallControl = 2\nEnd If\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('if (EnableBallControl == 1) {\n    EnableBallControl = 0;\n    EnableBallControl = 3;\n} else {\n    EnableBallControl = 1;\n    EnableBallControl = 2;\n}');
	});

	it ('should transpile an "If/Then...ElseIf/Then" statement', () => {
		const vbs = `If DayOfWeek = "MON" Then\nDay = 1\nElseIf DayOfWeek = "TUE" Then\nDay = 2\nElseIf DayOfWeek = "WED" Then\nDay=3\nEnd If\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('if (DayOfWeek == \'MON\') {\n    Day = 1;\n} else if (DayOfWeek == \'TUE\') {\n    Day = 2;\n} else if (DayOfWeek == \'WED\') {\n    Day = 3;\n}');
	});

	it ('should transpile an "If/Then...ElseIf/Then...ElseIf/Then...Else" statement', () => {
		const vbs = `If DayOfWeek = "MON" Then\nDay = 1\nElseIf DayOfWeek = "TUE" Then\nDay = 2\nElseIf DayOfWeek = "WED" Then\nDay=3\nElse\nDay = 0\nEnd If\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('if (DayOfWeek == \'MON\') {\n    Day = 1;\n} else if (DayOfWeek == \'TUE\') {\n    Day = 2;\n} else if (DayOfWeek == \'WED\') {\n    Day = 3;\n} else {\n    Day = 0;\n}');
	});

	it ('should transpile a "For...Next" statement', () => {
		const vbs = `For j = 1 To 20\ntotal = total + 1\nNext\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('for (j = 1; j <= 20; j += 1) {\n    total = total + 1;\n}');
	});

	it ('should transpile a "For/Step...Next" statement', () => {
		const vbs = `For j = 1 To 20 Step 3\ntotal = total + 1\nNext\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('for (j = 1; 3 < 0 ? j >= 20 : j <= 20; j += 3) {\n    total = total + 1;\n}');
	});

	it ('should transpile a "For/Each...Next" statement', () => {
		const vbs = `For Each x In students\ntotal = total + x\nNext\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('for (x of students) {\n    total = total + x;\n}');
	});

	it ('should transpile a "With...End With" statement', () => {
		const vbs = `With x\n.value = 5\n.type = \"TEST\"\nEnd With\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('{\n    x.value = 5;\n    x.type = \'TEST\';\n}');
	});

	it ('should transpile a "Do While...Loop" statement', () => {
		const vbs = `Dim x\nx = 1\nDo While x < 5\nx = x + 1\nLoop\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let x;\nx = 1;\nwhile (x < 5) {\n    x = x + 1;\n}');
	});

	it ('should transpile a "Do Until...Loop" statement', () => {
		const vbs = `Dim x\nx = 1\nDo Until x = 5\nx = x + 1\nLoop\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let x;\nx = 1;\ndo {\n    if (x == 5) {\n        break;\n    }\n    x = x + 1;\n} while (true);');
	});

	it ('should transpile a "Do...Loop While" statement', () => {
		const vbs = `Dim x\nx = 7\nDo\nx = x + 1\nLoop While x < 5\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let x;\nx = 7;\ndo {\n    x = x + 1;\n} while (x < 5);');
	});

	it ('should transpile a "Do...Loop Until" statement', () => {
		const vbs = `Dim i\ni = 10\nDo\ni = i + 1\nLoop Until i < 15\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let i;\ni = 10;\ndo {\n    i = i + 1;\n    if (i < 15) {\n        break;\n    }\n} while (true);');
	});

	it ('should transpile a "Do...Loop" statement', () => {
		const vbs = `Dim x\nx = 7\nDo\nx = x + 1\nLoop\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let x;\nx = 7;\ndo {\n    x = x + 1;\n} while (true);');
	});

	it ('should transpile a "While...WEnd" statement', () => {
		const vbs = `Dim x\nx = 1\nWhile x < 5\nx = x + 1\nWEnd\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('let x;\nx = 1;\nwhile (x < 5) {\n    x = x + 1;\n}');
	});

	it ('should transpile a "Select Case...End Select" statement', () => {
		const vbs = `Select Case today\nCase "Sunday"\nday=0\nCase "Monday"\nday=1\nCase "Tuesday"\nday=2\nCase "Wednesday"\nday=3\nEnd Select\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('switch (today) {\ncase \'Sunday\':\n    day = 0;\n    break;\ncase \'Monday\':\n    day = 1;\n    break;\ncase \'Tuesday\':\n    day = 2;\n    break;\ncase \'Wednesday\':\n    day = 3;\n    break;\n}');
	});

	it ('should transpile a "Select Case/Case...End Select" statement', () => {
		const vbs = `Select Case today\nCase "Saturday", "Sunday"\nweekend=1\nCase "Monday"\nweekend=0\nEnd Select\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('switch (today) {\ncase \'Saturday\':\ncase \'Sunday\':\n    weekend = 1;\n    break;\ncase \'Monday\':\n    weekend = 0;\n    break;\n}');
	});

	// it ('should transpile a "Select Case/Case...Else...End Select" statement', () => {
	// 	const vbs = `Select Case today\nCase "Saturday", "Sunday"\nweekend=1\nCase Else\nweekend=0\nEnd Select\n`;
	// 	const js = vbsToJs(vbs);
	// 	expect(js).to.equal('switch (today) {\ncase \'Saturday\':\ncase \'Sunday\':\n    weekend = 1;\n    break;\ndefault:\n    weekend = 0;\n}');
	// });

	it ('should transpile a statements separated with ":"', () => {
		const vbs = `gi1.State = 0:Gi2.State = 0\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('gi1.State = 0;\nGi2.State = 0;');
	});
});