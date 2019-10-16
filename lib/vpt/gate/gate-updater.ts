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

import { degToRad } from '../../math/float';
import { Matrix3D } from '../../math/matrix3d';
import { IRenderApi } from '../../render/irender-api';
import { ItemUpdater } from '../item-updater';
import { Table } from '../table/table';
import { GateData } from './gate-data';
import { GateState } from './gate-state';

export class GateUpdater extends ItemUpdater<GateState> {

	private readonly data: GateData;

	constructor(data: GateData, state: GateState) {
		super(state);
		this.data = data;
	}

	public applyState<NODE, GEOMETRY, POINT_LIGHT>(obj: NODE, state: GateState, renderApi: IRenderApi<NODE, GEOMETRY, POINT_LIGHT>, table: Table): void {

		// update local state
		Object.assign(this.state, state);

		this.applyVisibility(obj, state, renderApi);
		this.applyMaterial(obj, state.name, state.material, undefined, renderApi, table);

		// TODO update showBracket

		if (state.angle !== undefined) {
			this.applyAngle(obj, state, renderApi);
		}
	}

	private applyAngle<NODE, GEOMETRY, POINT_LIGHT>(obj: NODE, state: GateState, renderApi: IRenderApi<NODE, GEOMETRY, POINT_LIGHT>): void {
		const posZ = this.data.height;
		const matTransToOrigin = Matrix3D.claim().setTranslation(-this.data.vCenter.x, -this.data.vCenter.y, posZ);
		const matRotateToOrigin = Matrix3D.claim().rotateZMatrix(degToRad(-this.data.rotation));
		const matTransFromOrigin = Matrix3D.claim().setTranslation(this.data.vCenter.x, this.data.vCenter.y, -posZ);
		const matRotateFromOrigin = Matrix3D.claim().rotateZMatrix(degToRad(this.data.rotation));
		const matRotateX = Matrix3D.claim().rotateXMatrix(state.angle - degToRad(this.data.angleMin));

		const matrix = matTransToOrigin
			.multiply(matRotateToOrigin)
			.multiply(matRotateX)
			.multiply(matRotateFromOrigin)
			.multiply(matTransFromOrigin);

		const wireObj = renderApi.findInGroup(obj, `gate.wire-${this.data.getName()}`);
		renderApi.applyMatrixToNode(matrix, wireObj);

		Matrix3D.release(matTransToOrigin, matRotateToOrigin, matTransFromOrigin, matRotateFromOrigin, matRotateX);
	}
}