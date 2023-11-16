import {etherScan} from './indexEtherscan.js';
import { optimisticScan } from './indexOptimisticScan.js';
import { arbiScan } from './indexArbiscan.js';
import { polygonScan } from './indexPolygon.js';
import { bscScan } from './indexBscScan.js';

etherScan();
optimisticScan()
polygonScan();
arbiScan()
bscScan()