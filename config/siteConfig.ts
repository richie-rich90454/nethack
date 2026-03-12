// config/siteConfig.ts

export interface SiteConfig {
	siteTitle: string;
	nav: {
		home: string;
		login: string;
		logout: string;
		dashboard: string;
		showcase: string;
	};
	home: {
		welcomeHeading: string;
		introText: string;
		statusText: string;
		signUpUrl: string;
		countdownDates: string[]; // ISO date strings for countdowns
		countdownLabels: {
			registrationCloses: string;
			promptsRelease: string;
			submissionCloses: string;
		};
	};
	login: {
		heading: string;
		description: string;
		emailNote: string;
		accountTypeLabels: Record<number, string>;
		signUpPrompt: string;
		signUpApprovedNote: string;
		signInButton: string;
		signOutButton: string;
		loadingText: string;
		notLoggedInText: string;
		yourAccountInfo: string;
		nameLabel: string;
		emailLabel: string;
		accountTypeLabel: string;
		teamIdLabel: string;
	};
	dashboard: {
		accessDenied: string; // shown when user access level < 1
		loading: string; // shown while auth status loading
		loginRequired: string; // shown when not logged in
		loginLinkText: string; // text for login link
	};
	dashboardCompetitor: {
		heading: string; // use {name} placeholder
		intro: string;
		phaseIndicator: {
			closed: { label: string; tooltip: string };
			active: { label: string; tooltip: string };
			judging: { label: string; tooltip: string };
		};
		closedMessage: {
			title: string;
			timeRemainingLabel: string;
			countdownDate: string; // ISO date for countdown when closed
		};
		activeMessage: {
			title: string;
			timeRemainingLabel: string;
			countdownDate: string; // ISO date for countdown when active
		};
		judgingMessage: {
			title: string;
			message: string;
		};
	};
	dashboardJudge: {
		heading: string; // use {name} placeholder
		intro: string;
		judgingNotes: string[];
		additionalNotes: string[];
		editForm: {
			title: string;
			description: string;
		};
	};
	showcase: {
		heading: string;
		description: string;
		longDescription: string;
		winners: string[]; // team IDs of projects to display
		top3: {
			title: string;
			description: string;
		};
		honorableMentions: {
			title: string;
			description: string;
		};
		closing: string;
	};
	submission: {
		developedBy: string;
		builtUsing: string;
		chosenPrompt: string;
		untitled: string;
		noTechnologies: string;
		noPrompt: string;
		codeNotSubmitted: string;
		videoNotSubmitted: string;
		viewGithub: string;
		viewCode: string;
		viewVideo: string;
		downloadCode: string;
		compressedFolder: string;
		shareUrl: string;
	};
	submissionForm: {
		checklistTitle: string;
		yourTeamLabel: string;
		checklistComingSoon: string;
		projectTitlePlaceholder: string;
		descriptionLabel: string;
		descriptionPlaceholder: string;
		promptSelectLabel: string;
		prompts: string[]; // list of available prompt values
		technologiesLabel: string;
		technologiesPlaceholder: string;
		githubLabel: string;
		githubPlaceholder: string;
		saveButtonAria: string;
	};
	countdown: {
		timeUntilPrefix: string;
	};
	judgeToolbox: {
		title: string;
		editTitle: string;
		editTechs: string;
		addComment: string;
	};
	footer: {
		copyright: string;
	};
	externalUrls: {
		signUpForm: string;
	};
}

export const defaultSiteConfig: SiteConfig = {
	siteTitle: "Network Hackathon Site",

	nav: {
		home: "Home",
		login: "Login",
		logout: "Logout",
		dashboard: "Dashboard",
		showcase: "Showcase",
	},

	home: {
		welcomeHeading: "Welcome to the 2nd Annual BIBS·C Network Hackathon",
		introText:
			'We are all about <span class="serifBold">understanding</span> and <span class="serifBold">applying</span> technology. In a Hackathon, you are given limited time to draw on your skills and produce an original product. Your product may be focused on anything from programming to hardware to art - so long as it answers the competition\'s prompts.',
		statusText:
			"The 2025 Competition has begun! If you have registered, please login to your Hackathon account to view your project Dashboard and submit materials. Please note that this site experience as a beta test.",
		signUpUrl: "https://forms.cloud.microsoft/r/3t7EywybWw",
		countdownDates: [
			"2026-03-09T16:03:42+0800", // Registration Closes (one week before submission)
			"2026-03-10T16:30:42+0800", // Prompts Release (one day later)
			"2026-03-17T23:59:59+0800", // Submission Closes (your requested date)
		],
		countdownLabels: {
			registrationCloses: "Registration Closes",
			promptsRelease: "Prompts Release",
			submissionCloses: "Submission Closes",
		},
	},

	login: {
		heading: "User Login",
		description:
			"This is the portal for competitor, voter, and judge account login.",
		emailNote:
			"Please note you should login using your @basischina.com Microsoft email account.",
		accountTypeLabels: {
			0: "Visitor/Voter",
			1: "Competitor",
			2: "Judge",
		},
		signUpPrompt:
			"Signed up and approved? Please sign out and then login to view your dashboard!",
		signUpApprovedNote: "",
		signInButton: "Sign in",
		signOutButton: "Sign out",
		loadingText: "Loading...",
		notLoggedInText: "You are not currently logged in.",
		yourAccountInfo: "Your Account Information",
		nameLabel: "Name:",
		emailLabel: "Email:",
		accountTypeLabel: "Account type:",
		teamIdLabel: "Team ID:",
	},

	dashboard: {
		accessDenied:
			'Your account (<span class="serifBold">Visitor/Voter</span>) does not grant you access to this page.',
		loading: "Loading...",
		loginRequired: "You need to {link} to access this page.",
		loginLinkText: "Login",
	},

	dashboardCompetitor: {
		heading: "Dashboard for {name}",
		intro: "As a competitor, this is where you can view the progress of the competition and your project.",
		phaseIndicator: {
			closed: {
				label: "Closed",
				tooltip:
					"The Hackathon is Closed. It is currently not accepting work, meaning you may not edit or submit files at this time.",
			},
			active: {
				label: "Active",
				tooltip:
					"The Hackathon is Active. You have this time to complete all aspects of your project submission. Be mindful of the stated deadline and carefully follow the instructions given on this page.",
			},
			judging: {
				label: "Review",
				tooltip:
					"The Hackathon is Under Review. You are no longer able to edit your submission as it is being reviewed by judges and packaged for presentation.",
			},
		},
		closedMessage: {
			title: "Hackathon is Closed",
			timeRemainingLabel: "Time remaining:",
			countdownDate: "2025-02-17T08:59:59Z", // keep as is (past date)
		},
		activeMessage: {
			title: "Hackathon is Active",
			timeRemainingLabel: "Time remaining:",
			countdownDate: "2025-06-11T23:59:59+0800", // matches submission close
		},
		judgingMessage: {
			title: "Hackathon is Under Review",
			message: "Edits can no longer be made.",
		},
	},

	dashboardJudge: {
		heading: "Dashboard for {name}",
		intro: "As a Judge, this is where you can survey and manage the competition submission.",
		judgingNotes: [
			"Code, Video, and Project Information (title, description) should be mandatory.",
			"Github and Technologies list was explicitly stated to be optional.",
			"Submissions are uniquely identified by teamID.",
		],
		additionalNotes: [
			"Since these submissions will eventually be displayed on this site, it is better for submissions to have proper titles and technologies lists",
			"A very basic tool is given on the upper-right corner for you to edit these as needed. This will directly change the entries in our Hackathon database",
			"Links are included for your convenience. However, some may be broken/locked behind login; you may need to go back to the Teams assignment page to see the submission",
			"Additional judging features should be available for future rounds (e.g. Add Comment). For now we suggest you keep organized in external documents :(",
		],
		editForm: {
			title: "Edit Submission",
			description:
				"You can add information such as technologies and title.",
		},
	},

	showcase: {
		heading: "Project Showcase (2025R1)",
		description:
			'The projects on this page are all <span class="serifBold">original student work</span>, submitted as part of the 2nd Annual BIBS·C Network Hackathon. Participants were given 1 week to develop a project from scratch that responds to one of the Hackathon prompts - from conceptualization to implementation to presentation, students took charge of their projects.',
		longDescription:
			"Out of 24 qualifying projects from 65 students across 5 schools, these projects were selected by a panel of judges as exemplary and representative work. A Hackathon is all about applying technology in unique ways to solve practical problems, so projects were assessed on their use of technology, originality, presentation, topicality, and usability. Whenever possible, we have placed the interactive version of their project's on this site; code download is also available. We encourage you to reach out to these students via Teams if you want to learn more about their projects!",
		winners: [
			"c0ad4f19",
			"d34f1c1d",
			"dbb3b35b",
			"012ba255",
			"17b07c3a",
			"46ff65b7",
			"f4da2d19",
			"7fea1e8e",
		],
		top3: {
			title: "Our Top 3:",
			description:
				'Our judges were very impressed with the quality of the project submissions this Round, and it was difficult to rank the Finalists. The following projects are all compelling in their own way: <span class="serifBold">Natural Selection Simulation</span> takes first place because of how impressively it embodies the "Theory and Reality" prompt, powerfully demonstrating the power of computational simulation in modeling and communicating scientific theories. Next, <span class="serifBold">Local-Server-Chat</span> explores the very fundamentals of the technology that is found all around us and so often taken for granted, creating a chat server usable by anyone. <span class="serifBold">N-Body Simulation</span> is an exciting project that uses visualization to bring gravitation and our solar system to life.',
		},
		honorableMentions: {
			title: "The remaining Finalists (Honorable Mentions):",
			description:
				"We believe all of Finalist projects were impressive enough to be worth your time exploring, so all of them are presented here. In no particular order, here is another set of diverse and captivating projects:",
		},
		closing:
			"We are immensely proud of all of our participants, and we can honestly say that we learned something new from each project. We will be trying to put up more projects for public viewing in the future, but for now we hope you enjoyed this exhibition of the power of technology.",
	},

	submission: {
		developedBy: "Developed by",
		builtUsing: "Built using",
		chosenPrompt: "Chosen prompt",
		untitled: "Untitled Submission",
		noTechnologies: "No Technologies Listed",
		noPrompt: "No Prompt Selected",
		codeNotSubmitted: "[Code NOT SUBMITTED]",
		videoNotSubmitted: "[Video NOT SUBMITTED]",
		viewGithub: "[View GitHub]",
		viewCode: "[View Code]",
		viewVideo: "[View Video]",
		downloadCode: "Download code:",
		compressedFolder: "Compressed Folder",
		shareUrl: "Share URL:",
	},

	submissionForm: {
		checklistTitle: "Project Checklist",
		yourTeamLabel: "Your team:",
		checklistComingSoon: "Checklist Coming Soon",
		projectTitlePlaceholder: "Project Title",
		descriptionLabel: "Project Description",
		descriptionPlaceholder: "Describe your project in 3-8 sentences.",
		promptSelectLabel: "Prompt Select",
		prompts: ["Game Jam"], // extend as needed
		technologiesLabel: "List of technologies (optional)",
		technologiesPlaceholder: "e.g. Javascript, Python, numpy, Scratch",
		githubLabel: "Link to Github (optional)",
		githubPlaceholder: "https://...",
		saveButtonAria: "Save",
	},

	countdown: {
		timeUntilPrefix: "Time until",
	},

	judgeToolbox: {
		title: "Judge Tools",
		editTitle: "Edit Title",
		editTechs: "Edit Techs",
		addComment: "Add Comment",
	},

	footer: {
		copyright: "© 2026 BISZ Developers' Club.",
	},

	externalUrls: {
		signUpForm: "https://forms.cloud.microsoft/r/3t7EywybWw",
	},
};

// Optional: allow user overrides
export const siteConfig = defaultSiteConfig;
