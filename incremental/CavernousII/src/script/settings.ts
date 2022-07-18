interface settings {
	usingBankedTime: boolean;
	running: boolean;
	autoRestart: number;
	useWASD: boolean;
	useDifferentBridges: boolean;
	grindMana: boolean;
	grindStats: boolean;
	loadPrereqs: boolean;
	warnings: boolean;
	followZone: boolean;
	timeline: boolean;
	maxTotalTick: number;
	statGrindPerSec: boolean;
	longWait: number;
	pauseOnPortal: boolean;
	debug_statIncreaseDivisor?: number;
	debug_verticalBlocksJustify?: string;
}

const MAX_TICK = 250;

const settings: settings = {
	usingBankedTime: true,
	running: true,
	autoRestart: 0,
	useWASD: false,
	useDifferentBridges: true,
	grindMana: false,
	grindStats: false,
	loadPrereqs: false,
	warnings: true,
	followZone: true,
	timeline: true,
	maxTotalTick: 10000,
	statGrindPerSec: false,
	longWait: 5000,
	pauseOnPortal: false,
};

function setSetting<T, Y extends any[]>(toggler: (...args: Y) => T, value: T, ...args: Y) {
	for (let i = 0; i < 99; i++) {
		const v = toggler(...args);
		if (v === value) return v;
	}
	return null;
}

function toggleBankedTime() {
	settings.usingBankedTime = !settings.usingBankedTime;
	document.querySelector("#time-banked-toggle")!.innerHTML = settings.usingBankedTime ? "Using" : "Banking";
	return settings.usingBankedTime;
}

function toggleRunning() {
	settings.running = !settings.running;
	document.querySelector("#running-toggle")!.innerHTML = settings.running ? "Running" : "Paused";
	document.querySelector("#running-toggle")!.closest(".option")!.classList.toggle("option-highlighted", !settings.running);
	document.title = "Cavernous II" + (settings.running ? "" : " - Paused");
	return settings.running;
}

enum AutoRestart {
	WaitAny = 0,
	RestartDone = 1,
	RestartAlways = 2,
	WaitAll = 3,
}

function toggleAutoRestart() {
	const autoRestartText = ["Wait when any complete", "Restart when complete", "Restart always", "Wait when all complete"];
	settings.autoRestart = (settings.autoRestart + 1) % autoRestartText.length;
	document.querySelector("#auto-restart-toggle")!.innerHTML = autoRestartText[settings.autoRestart];
	document
		.querySelector("#auto-restart-toggle")!
		.closest(".option")!
		.classList.toggle("option-highlighted", settings.autoRestart === 0);
	return settings.autoRestart;
}

function toggleUseWASD() {
	settings.useWASD = !settings.useWASD;
	document.querySelector("#use-wasd-toggle")!.innerHTML = settings.useWASD ? "Use arrow keys" : "Use WASD";
	document.querySelector("#auto-restart-key")!.innerHTML = settings.useWASD ? "C" : "W";
	document.querySelector("#auto-stat-grind-key")!.innerHTML = settings.useWASD ? "T" : "S";
	return settings.useWASD;
}

function toggleGrindMana(event?: KeyboardEvent) {
	if (event?.ctrlKey || event?.metaKey){
		Route.invalidateRouteCosts();
		return;
	}
	Route.resetHasAttempted();
	settings.grindMana = !settings.grindMana;
	document.querySelector("#grind-mana-toggle")!.innerHTML = settings.grindMana ? "Grinding mana rocks" : "Not grinding mana rocks";
	document.querySelector("#grind-mana-toggle")!.closest(".option")!.classList.toggle("option-highlighted", settings.grindMana);
	settings.grindStats = false;
	document.querySelector("#grind-stat-toggle")!.innerHTML = "Not grinding stats";
	document.querySelector("#grind-stat-toggle")!.closest(".option")!.classList.remove("option-highlighted");
	return settings.grindMana;
}

function toggleGrindStats() {
	settings.grindStats = !settings.grindStats;
	document.querySelector("#grind-stat-toggle")!.innerHTML = settings.grindStats ? "Grinding stats" : "Not grinding stats";
	document.querySelector("#grind-stat-toggle")!.closest(".option")!.classList.toggle("option-highlighted", settings.grindStats);
	settings.grindMana = false;
	document.querySelector("#grind-mana-toggle")!.innerHTML = "Not grinding mana rocks";
	document.querySelector("#grind-mana-toggle")!.closest(".option")!.classList.remove("option-highlighted");
	return settings.grindStats;
}

function toggleLoadPrereqs() {
	settings.loadPrereqs = !settings.loadPrereqs;
	document.querySelector("#load-prereq-toggle")!.innerHTML = settings.loadPrereqs ? "Load prereqs" : "Load only zone route";
	return settings.loadPrereqs;
}

function toggleWarnings() {
	settings.warnings = !settings.warnings;
	document.querySelector("#warnings")!.innerHTML = settings.warnings ? "Showing warnings" : "Not showing warnings";
	return settings.warnings;
}

function toggleFollowZone() {
	settings.followZone = !settings.followZone;
	document.querySelector("#follow-zone-toggle")!.innerHTML = settings.followZone ? "Follow on zone complete" : "Stay on selected zone";
	return settings.followZone;
}

function toggleTimeline() {
	settings.timeline = !settings.timeline;
	document.querySelector("#timeline-toggle")!.innerHTML = settings.timeline ? "Showing timeline" : "Hiding timeline";
	document.querySelector<HTMLElement>("#timelines")!.hidden = !settings.timeline;
	return settings.timeline;
}

function toggleStatGrindPerSec() {
	settings.statGrindPerSec = !settings.statGrindPerSec;
	document.querySelector("#stat-grind-per-sec")!.innerHTML = settings.statGrindPerSec ? "Stat grind strategy: Per sec" : "Stat grind strategy: Total";
	return settings.statGrindPerSec;
}

function togglePauseOnPortal() {
	settings.pauseOnPortal = !settings.pauseOnPortal;
	document.querySelector("#pause-on-portal-toggle")!.innerHTML = settings.pauseOnPortal ? "Pause when entering a portal" : "Do not pause on portal";
	return settings.pauseOnPortal;
}

function setMaxTickTime(element: HTMLInputElement) {
	let value = +element.value;
	if (!isNaN(value)){
		settings.maxTotalTick = Math.max(250, value || 5000);
	}
	element.value = settings.maxTotalTick.toString();
}

function setLongWaitTime(element: HTMLInputElement) {
	let value = +element.value;
	if (!isNaN(value)){
		settings.longWait = Math.max(100, value);
	}
	element.value = settings.longWait.toString();
}

function loadSettings(savedSettings: settings) {
	setSetting(toggleBankedTime, savedSettings.usingBankedTime);
	setSetting(toggleRunning, !!savedSettings.running);
	setSetting(toggleAutoRestart, savedSettings.autoRestart);
	if (!!savedSettings.grindMana) setSetting(toggleGrindMana, !!savedSettings.grindMana);
	if (!!savedSettings.grindStats) setSetting(toggleGrindStats, !!savedSettings.grindStats);
	setSetting(toggleLoadPrereqs, !!savedSettings.loadPrereqs);
	setSetting(toggleFollowZone, !!savedSettings.followZone);
	setSetting(toggleTimeline, !!savedSettings.timeline);
	setSetting(toggleStatGrindPerSec, !!savedSettings.statGrindPerSec);
	const maxTimeInput = <HTMLInputElement>document.querySelector("#max-time");
	if (maxTimeInput) setMaxTickTime(maxTimeInput);
	const longWaitInput = <HTMLInputElement>document.querySelector("#long-wait");
	if (longWaitInput) setMaxTickTime(longWaitInput);

	Object.assign(settings, savedSettings, settings);
}

const configBox: HTMLElement =
	document.querySelector("#config-box") ??
	(() => {
		throw new Error("No config box found");
	})();

function hideConfig() {
	configBox.hidden = true;
}

function viewConfig() {
	configBox.hidden = false;
}
