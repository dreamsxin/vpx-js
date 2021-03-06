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

import { PlayerPhysics } from '../game/player-physics';
import { AnimObject } from './anim-object';

/**
 * Slingshot animations are only visible when the ball hit the slingshot
 * segment of a surface. They look ugly and I don't think they are used
 * in any tables today. Thus, they aren't currently implemented.
 */
export class SlingshotAnimObject implements AnimObject {
	/**
	 * Time at which to pull in slingshot, Zero means the slingshot is currently reset
	 */
	public timeReset: number = 0;
	public animations: boolean = false;
	public iframe: boolean = false;

	public animate(physics: PlayerPhysics) {
		if (!this.iframe && this.timeReset !== 0 && this.animations) {
			this.iframe = true;

		} else if (this.iframe && this.timeReset < physics.timeMsec) {
			this.iframe = false;
			this.timeReset = 0;
		}
	}
}
