import { test, expect } from "@playwright/test";

test.describe("Lesson Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Reset progress by clearing localStorage
		await page.addInitScript(() => {
			localStorage.clear();
		});
		await page.goto("/");
	});

	test("completes a full lesson by correctly answering all quizzes", async ({
		page,
	}) => {
		// 1. Check home page loads
		await expect(page.getByText("Mandarin Master")).toBeVisible();

		// 2. Start Lesson 1-1
		const lessonNode = page.locator(".lesson-node").first();
		await lessonNode.click();

		// 3. Intro Sequence
		// 3. Handle potential Grammar Tip
		const gotItButton = page.getByRole("button", { name: "Got it!" });
		if (await gotItButton.isVisible()) {
			await gotItButton.click();
		}

		// 4. Intro Sequence
		await expect(page.getByText("New Words")).toBeVisible();

		// Iterate through intro words
		while (await page.getByRole("button", { name: "Next" }).isVisible()) {
			await page.getByRole("button", { name: "Next" }).click();
		}
		const startBtn = page.getByRole("button", { name: "Start Practice" });
		if (await startBtn.isVisible()) {
			await startBtn.click();
		}

		// 4. Quiz Loop
		// Use a loop to answer questions until we see "Lesson Complete!"
		// Limit loop to prevent infinite loop
		let stepCount = 0;
		const MAX_STEPS = 50;

		while (stepCount < MAX_STEPS) {
			// Check for victory
			if (
				await page.getByText("Lesson Complete!", { exact: false }).isVisible()
			) {
				break;
			}

			// Check for different quiz types

			// A. Multiple Choice (Hanzi -> English, Audio -> Hanzi, English -> Hanzi)
			const correctOption = page.locator('button[data-is-correct="true"]');
			if (
				(await correctOption.count()) > 0 &&
				(await correctOption.first().isVisible())
			) {
				await correctOption.first().click();
				// Wait for "Continue" button
				const continueBtn = page.getByRole("button", { name: "Continue" });
				await continueBtn.click();
				stepCount++;
				await page.waitForTimeout(100); // Wait for transition
				continue;
				await page.waitForTimeout(500); // Wait for transition
				continue;
			}

			// A.1 Theory Slide
			const gotItBtn = page.getByRole("button", { name: "Got it!" });
			if (await gotItBtn.isVisible()) {
				await gotItBtn.click();
				stepCount++;
				await page.waitForTimeout(100);
				continue;
			}

			// B. Matching Pairs
			const leftItems = page.locator(
				'button[data-testid^="match-left-"]:not([disabled])',
			);
			if (
				(await leftItems.count()) > 0 &&
				(await leftItems.first().isVisible())
			) {
				// Match all pairs
				while ((await leftItems.count()) > 0) {
					const left = leftItems.first();
					const pairId = await left.getAttribute("data-pair-id");
					if (!pairId) break;

					await left.click();
					await page
						.locator(`button[data-testid="match-right-${pairId}"]`)
						.click();
					await page.waitForTimeout(100);
				}
				// Click Continue
				await page.getByRole("button", { name: "Continue" }).click();
				stepCount++;
				await page.waitForTimeout(100);
				continue;
			}

			// C. Sentence Duel
			const solutionHint = page.locator('div[data-testid="solution-hint"]');
			if ((await solutionHint.count()) > 0) {
				const solutionStr = await solutionHint.getAttribute("data-solution");
				if (solutionStr) {
					const cardIds = solutionStr.split(",");
					for (const id of cardIds) {
						const cardBtn = page
							.locator(`button[data-testid="word-bank-item-${id}"]`)
							.first();
						if (await cardBtn.isVisible()) {
							await cardBtn.click();
						}
					}
					// Click Check Answer
					await page.getByRole("button", { name: "Check Answer" }).click();

					// Click Next Challenge
					await page
						.getByRole("button", { name: "Next Challenge" })
						.click({ force: true });
					stepCount++;
					await page.waitForTimeout(100);
					continue;
				}
			}

			// Fallthrough logging
			console.log(
				`DEBUG: Step ${stepCount}: No known quiz type matched. Current text:`,
			);
			console.log((await page.textContent("body"))?.substring(0, 500)); // Log first 500 chars

			await page.waitForTimeout(200);
			stepCount++;
		}

		// 5. Verify Victory Screen
		await expect(page.getByText("Lesson Complete!")).toBeVisible();
		await expect(page.getByText("XP Earned")).toBeVisible();

		// Click Continue
		await page.getByRole("button", { name: "Continue" }).click();

		// Should be back on Roadmap
		await expect(page.locator(".lesson-node").first()).toBeVisible();
	});
});
