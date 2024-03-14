import { Pool, types } from "pg";

import { settings } from "../../settings/setting";

types.setTypeParser(1700, (val) => parseFloat(val));

export const db = new Pool({ ...settings.postgres });

