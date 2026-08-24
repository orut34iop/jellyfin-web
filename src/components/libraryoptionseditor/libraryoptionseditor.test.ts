import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const componentDir = join(process.cwd(), 'src/components/libraryoptionseditor');
const stringsDir = join(process.cwd(), 'src/strings');

function readComponentFile(fileName: string) {
    return readFileSync(join(componentDir, fileName), 'utf8');
}

describe('libraryoptionseditor LocalMetadataOnlyImport option', () => {
    it('renders the checkbox below the enabled library checkbox by default', () => {
        const template = readComponentFile('libraryoptionseditor.template.html');

        const enabledIndex = template.indexOf('chkEnabledContainer');
        const localMetadataOnlyIndex = template.indexOf('chkLocalMetadataOnlyImportContainer');

        expect(enabledIndex).toBeGreaterThanOrEqual(0);
        expect(localMetadataOnlyIndex).toBeGreaterThan(enabledIndex);
        expect(template).toContain('class="chkLocalMetadataOnlyImport" checked');
        expect(template).toContain('${LocalMetadataOnlyImport}');
        expect(template).toContain('${LocalMetadataOnlyImportHelp}');
        expect(template).toContain('class="chkCreateLocalPersonItems"');
        expect(template).toContain('${CreateLocalPersonItems}');
        expect(template).toContain('${CreateLocalPersonItemsHelp}');
    });

    it('binds LocalMetadataOnlyImport into saved and restored library options', () => {
        const editor = readComponentFile('libraryoptionseditor.js');

        expect(editor).toContain("LocalMetadataOnlyImport: parent.querySelector('.chkLocalMetadataOnlyImport').checked");
        expect(editor).toContain("parent.querySelector('.chkLocalMetadataOnlyImport').checked = options.LocalMetadataOnlyImport === true");
        expect(editor).toContain("CreateLocalPersonItems: parent.querySelector('.chkCreateLocalPersonItems').checked");
        expect(editor).toContain("parent.querySelector('.chkCreateLocalPersonItems').checked = options.CreateLocalPersonItems === true");
    });

    it('adds English and Simplified Chinese strings', () => {
        const english = JSON.parse(readFileSync(join(stringsDir, 'en-us.json'), 'utf8'));
        const chinese = JSON.parse(readFileSync(join(stringsDir, 'zh-cn.json'), 'utf8'));

        expect(english.LocalMetadataOnlyImport).toBe('Local Metadata Only Import');
        expect(english.LocalMetadataOnlyImportHelp).toContain('local NFO files');
        expect(chinese.LocalMetadataOnlyImport).toBe('极速导入');
        expect(chinese.LocalMetadataOnlyImportHelp).toContain('本地 NFO');
        expect(english.CreateLocalPersonItems).toContain('person');
        expect(chinese.CreateLocalPersonItems).toContain('人物');
    });
});
