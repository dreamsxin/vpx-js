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

import { EventProxy } from '../../game/event-proxy';
import { PlayerPhysics } from '../../game/player-physics';
import { degToRad } from '../../math/float';
import { clamp } from '../../math/functions';
import { Vertex2D } from '../../math/vertex2d';
import { CollisionEvent } from '../../physics/collision-event';
import { CollisionType } from '../../physics/collision-type';
import { PHYS_SKIN } from '../../physics/constants';
import { HitObject } from '../../physics/hit-object';
import { LineSeg } from '../../physics/line-seg';
import { Ball } from '../ball/ball';
import { SpinnerData } from './spinner-data';
import { SpinnerMover } from './spinner-mover';
import { SpinnerState } from './spinner-state';

export class SpinnerHit extends HitObject {

	private readonly data: SpinnerData;
	private readonly state: SpinnerState;
	private readonly mover: SpinnerMover;
	private readonly lineSegs: LineSeg[] = [];

	constructor(data: SpinnerData, state: SpinnerState, events: EventProxy, height: number) {
		super();

		this.data = data;
		this.state = state;
		const halfLength = data.length * 0.5;

		const radAngle = degToRad(data.rotation);
		const sn = Math.sin(radAngle);
		const cs = Math.cos(radAngle);

		const v1 = new Vertex2D(
			data.center.x - cs * (halfLength + PHYS_SKIN), // through the edge of the
			data.center.y - sn * (halfLength + PHYS_SKIN), // spinner
		);
		const v2 = new Vertex2D(
			data.center.x + cs * (halfLength + PHYS_SKIN), // oversize by the ball radius
			data.center.y + sn * (halfLength + PHYS_SKIN), // this will prevent clipping
		);
		this.lineSegs.push(new LineSeg(v1, v2, height, height + (2.0 * PHYS_SKIN), CollisionType.Spinner));
		this.lineSegs.push(new LineSeg(v2.clone(), v1.clone(), height, height + (2.0 * PHYS_SKIN), CollisionType.Spinner));

		this.mover = new SpinnerMover(data, state, events);
		this.state.angle = clamp(0.0, this.mover.angleMin, this.mover.angleMax);
	}

	public getMoverObject(): SpinnerMover {
		return this.mover;
	}

	public calcHitBBox(): void {
		// Bounding rect for both lines will be the same
		this.lineSegs[0].calcHitBBox();
		this.hitBBox = this.lineSegs[0].hitBBox;
	}

	public hitTest(ball: Ball, dTime: number, coll: CollisionEvent, physics: PlayerPhysics): number {
		if (!this.isEnabled) {
			return -1.0;
		}
		for (let i = 0; i < 2; ++i) {
			const hitTime = this.lineSegs[i].hitTestBasic(ball, dTime, coll, false, true, false); // any face, lateral, non-rigid
			if (hitTime >= 0) {
				// signal the Collide() function that the hit is on the front or back side
				coll.hitFlag = !i;
				return hitTime;
			}
		}
		return -1.0;
	}

	public collide(coll: CollisionEvent, physics: PlayerPhysics): void {

		const dot = coll.hitNormal.dot(coll.ball.hit.vel);
		if (dot < 0) {                                     // hit from back doesn't count
			return;
		}

		const h = this.data.height * 0.5;

		// h is the height of the spinner axis;
		// Since the spinner has no mass in our equation, the spot
		// h -coll.m_radius will be moving a at linear rate of
		// 'speed'.  We can calculate the angular speed from that.

		this.mover.angleSpeed = Math.abs(dot);             // use this until a better value comes along
		if (Math.abs(h) > 1.0) {                           // avoid divide by zero
			this.mover.angleSpeed /= h;
		}
		this.mover.angleSpeed *= this.mover.damping;

		// We encoded which side of the spinner the ball hit
		if (coll.hitFlag) {
			this.mover.angleSpeed = -this.mover.angleSpeed;
		}
	}
}
