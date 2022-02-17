import { setupFakeServer } from "./__fake_server";

setupFakeServer();
window.gon.isSandbox = true;

import "./commons";
import "./behaviors";
