import Watcher from "./watcher";
import Truverifi from "./truverifi";

(async () => {
	const client = new Truverifi("dyLQYpHg56tNCC2yaPGakitC", "FACEBOOK");
	const watcher = new Watcher(client);

	// await client.startVerification();
	const code = await watcher.waitForVerification();

	console.log(code);
})();
