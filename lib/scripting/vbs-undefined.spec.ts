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

import * as chai from 'chai';
import { expect } from 'chai';
import { VbsUndefined } from './vbs-undefined';

/* tslint:disable:no-unused-expression no-string-literal */
chai.use(require('sinon-chai'));
describe('The VBScript undefined handler', () => {

	it('should be comparable', () => {
		const undef = new VbsUndefined() as unknown;
		// tslint:disable-next-line:triple-equals
		expect(() => undef == 1).not.to.throw();
	});

	it('should return "undefined" as string', () => {
		const undef = new VbsUndefined() as unknown;
		// tslint:disable-next-line:triple-equals
		expect('' + undef).to.equal('undefined');
	});

});
