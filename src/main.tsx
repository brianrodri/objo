import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { render } from "preact";
import { MyPluginCodeBlock } from "./components";

export interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: "default",
};

export class MyPlugin extends Plugin {
    private settings: MyPluginSettings = { ...DEFAULT_SETTINGS };

    public override async onload(): Promise<void> {
        await this.loadSettings();

        // This creates an icon in the left ribbon that will bring up a notice when clicked.
        const ribbonIconEl: HTMLElement = this.addRibbonIcon(
            "dice",
            "Sample Plugin",
            () => new Notice("This is a notice!"),
        );

        // Free to use the full power of DOM manipulation because icons are valid HTMLElements.
        ribbonIconEl.addClass("my-plugin-ribbon-class");

        // However when creating event listeners, it's best to register them with the plugin to ensure they get cleaned up properly.
        this.registerDomEvent(document, "click", (evt: MouseEvent) => {
            console.log("click", evt);
        });
        // It's also best to register intervals with the plugin.
        this.registerInterval(
            window.setInterval(
                () => console.log("MyPlugin heartbeat"),
                60 * 1000, // 60 seconds
            ),
        );

        // Adds a status bar item to the bottom of the app (NOTE: the status bar is not available on the mobile app).
        const statusBarItemEl: HTMLElement = this.addStatusBarItem();
        statusBarItemEl.setText("Status Bar Text");

        // Replaces code blocks annotated with the specified language (here: "sample-plugin") with a rendered React component.
        //
        // For example, a code block like this:
        // ```sample-plugin
        // This is some input
        // ```
        //
        // Will render the React component instead of a code block when the editor is in view mode.
        this.registerMarkdownCodeBlockProcessor("sample-plugin", (codeBlockContent, codeBlockRootElement) => {
            render(<MyPluginCodeBlock input={codeBlockContent} pluginSettings={this.settings} />, codeBlockRootElement);
        });

        this.addCommand({
            id: "open-modal",
            name: "Open modal",
            callback: () => new MyPluginModal(this.app).open(),
        });

        this.addCommand({
            id: "open-modal-conditionally",
            name: "Open modal conditionally",
            checkCallback: (dryRun: boolean) => {
                const check = this.app.workspace.getActiveViewOfType(MarkdownView) !== null;
                if (check && !dryRun) {
                    new MyPluginModal(this.app).open();
                }
                return check;
            },
        });

        // Example of a command that can mutate the editor (here: replacing the currently-selected text with something else).
        this.addCommand({
            id: "replace-selected-text",
            name: "Replace selected text",
            editorCallback: (editor) => editor.replaceSelection("Sample Editor Command"),
        });

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new MyPluginSettingTab(this.app, this));
    }

    public override async onunload(): Promise<void> {
        await this.saveSettings();
        console.log("MyPlugin settings saved");
    }

    /** Returns the plugin settings. */
    public getSettings(): MyPluginSettings {
        return this.settings;
    }

    /** Updates the plugin settings. */
    public overwriteSettings(changes: Partial<MyPluginSettings>): void {
        this.settings = { ...this.settings, ...changes };
    }

    /** Asynchronously loads the plugin settings from Obsidian's configuration storage. */
    public async loadSettings(): Promise<void> {
        const data = await this.loadData();
        this.settings = { ...DEFAULT_SETTINGS, ...data };
    }

    /** Asynchronously saves the plugin settings to Obsidian's configuration storage. */
    public async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}

class MyPluginModal extends Modal {
    public override onOpen() {
        const { contentEl } = this;
        contentEl.setText("Woah!");
    }

    public override onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class MyPluginSettingTab extends PluginSettingTab {
    private readonly plugin: MyPlugin;

    public constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    public override async display(): Promise<void> {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("Setting #1")
            .setDesc("It's a secret")
            .addText((text) =>
                text
                    .setPlaceholder("Enter your secret")
                    .setValue(this.plugin.getSettings().mySetting)
                    .onChange((value) => {
                        this.plugin.overwriteSettings({ mySetting: value });
                        this.plugin.saveSettings();
                    }),
            );
    }
}

export default MyPlugin;
