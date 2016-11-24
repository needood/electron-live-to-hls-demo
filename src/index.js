import {initSocket} from "./websocket";
import recorder from "./recorder";

initSocket();
recorder.init();

export default recorder;
