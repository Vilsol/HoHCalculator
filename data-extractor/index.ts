import {loadData} from './sval/loader';
import * as fs from 'fs';

const data = loadData('E:/SteamLibrary/steamapps/common/Heroes of Hammerwatch/unpacked_assets');

fs.writeFileSync('data.json', JSON.stringify(data));
