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

import { ItemState } from '../item-state';

export class TriggerState extends ItemState {

	public heightOffset: number;

	constructor(name: string, heightOffset: number = 0) {
		super(name);
		this.heightOffset = heightOffset;
	}

	public equals(state: TriggerState): boolean {
		if (!state) {
			return false;
		}
		return state.heightOffset === this.heightOffset;
	}

	public clone(): TriggerState {
		return new TriggerState(this.name, this.heightOffset);
	}
}