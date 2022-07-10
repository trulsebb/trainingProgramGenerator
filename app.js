"use strict";

const movements = [
    {
        "group": "Squat",
        "movements": 
            [
                {"mid": 0, "label": "Squats"},
                {"mid": 1, "label": "Highbar squats"},
                {"mid": 2, "label": "Paused squats"},
                {"mid": 3, "label": "Front squats"},
                {"mid": 4, "label": "SSB squats"},
                {"mid": 21, "label": "Highbar paused squats"},
            ]
    }, {
        "group": "Bench",
        "movements": 
            [
                {"mid": 5, "label": "Bench press"},
                {"mid": 6, "label": "Medium grip bench press"},
                {"mid": 7, "label": "Close grip bench press"},
                {"mid": 8, "label": "Larsen press"},
                {"mid": 9, "label": "Close grip Larsen press"},
                {"mid": 10, "label": "Medium grip Larsen pin press"},
                {"mid": 20, "label": "Incline press"},
                {"mid": 22, "label": "Log press"},
                {"mid": 23, "label": "Floor press"}
            ]
    }, {
        "group": "Deadlift",
        "movements": 
            [
                {"mid": 11, "label": "Deadlifts"},
                {"mid": 12, "label": "Deficit deadlifts"},
                {"mid": 13, "label": "Snatch grip deadlifts"},
                {"mid": 14, "label": "Block pulls"},
                {"mid": 25, "label": "Sumo deadlifts"},
            ]
    }, {
        "group": "Other",
        "movements": 
            [
                {"mid": 15, "label": "Sealrow"},
                {"mid": 16, "label": "Standing row"},
                {"mid": 17, "label": "Pullups"},
                {"mid": 18, "label": "Weighted pullups"},
                {"mid": 19, "label": "Weighted dips"},
                {"mid": 24, "label": "Bulgarian split squats"}
            ]
    }
];

const standardPrograms = [
    {
        id: 0,
        title: "Basic training program",
        shareString: "ko0408084448k-2+48484A0c4448s-2+4c448-23Wkk484g04w8084448k-2+48484A0c4448s-2+4c448-23Wkk484g0488084448k-2+48484A0c4448s-2+4c448-23Wkk484g04A8084448k-2+48484A0c4448s-2+4c448-23Wkk484g04I8084448k-2+48484A0c4448s-2+4c448-23Wkk484g04E8084448k-2+48484A0c4448s-2+4c448-23Wkk484g"
    },
    {
        id: 1,
        title: "Swiss program",
        shareString: "kk0808084448k-2+48484A0c4448s-2+4c448-23Wkk484g-21i8084448w-2+48484w0c4448E-2+4c448-23Wkk484g08k8084448k-2+48484A0c4448s-2+4c448-23Wkk484g-21m8084448k-2+48484A0c4448s-2+4c448-23Wkk484g08I8084448k-2+48484A0c4448s-2+4c448-23Wkk484gs8084448w-2+48484w0c4448E-2+4c448-23Wkk484g08-21u8084448k-2+48484A0c4448s-2+4c448-23Wkk484g-21q8084448k-2+48484w0c4448s-2+4c448-23Wkk484g08-21C8084448w-2+48484w0c4448E-2+4c448-23Wkk484g-21u8084448w-2+48484w0c4448E-2+4c448-23Wkk484g"
    },
    {
        id: 2,
        title: "Oldschool linear",
        shareString: "oo04040c4448E-2+4c448-23Kgk448E-2+404w40c4448E-2+4c448-23Kgk448E-2+404840c4448E-2+4c448-23Kgk448E-2+404A40c4448E-2+4c448-23Kgk448E-2+404I40c4448E-2+4c448-23Kgk448E-2+404E40c4448E-2+4c448-23Kgk448E-2+4"
    },
    {
        id: 3,
        title: "Advanzed program",
        shareString: "ko0408084448k-2+48484A0c4448s-2+4c448-23Wkk484g04wk088484Ac484-25a088484Ac484-25u088484Ac484-25O088484Ac484-268088484Ac484-23S0488084448k-2+48484A0c4448s-2+4c448-23Wkk484g04Ak088484Ac484-25a088484Ac484-25u088484Ac484-25O088484Ac484-268088484Ac484-23S04I8084448k-2+48484A0c4448s-2+4c448-23Wkk484g04Ek088484Ac484-25a088484Ac484-25u088484Ac484-25O088484Ac484-268088484Ac484-23S"
    }
];

const PROGRAMSELECT_ID = 9999;

const maxFormula = (weight, reps) => weight * (36 / (37 - reps));
const rpeBasedMax = wantedReps => weight => reps => rpe => maxFormula(weight, (reps + (11 - rpe - wantedReps)));
const oneRepMax = rpeBasedMax(1);
const presentableWeightValue = number => {
    const rounded = 2.5 * Math.round(number / 2.5);
    return rounded > 0 ? rounded : '';
};

const b62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const decToB62 = decValue => {
    if (decValue == 0) { 
        return 0;
    }
    let newValue = '';
    const appendThis = (decValue < 0) ? '+' : '';
    let absDecValue = (Math.abs(decValue) * 4).toFixed();
    while (absDecValue > 0) {
        newValue = b62Chars[absDecValue % 62] + newValue;
        absDecValue = (absDecValue - (absDecValue % 62)) / 62;
    }
    return appendThis + newValue;
};
const b62ToDec = b62Value => {
    const isNegative = (b62Value[0] === '+');
    const absB62Value = (b62Value[0] === '+') ? b62Value.slice(1) : b62Value;
    const decValue = (absB62Value.split('').map(c => b62Chars.findIndex(s => s == c)).reverse().map((v, i) => v*62**i).reduce((acc, val) => acc + val)) / 4;
    return (isNegative) ? decValue * -1 : decValue;
};

class IdCreator {
    static latestId = 1000;
    static resetId() {
        this.latestId = 1000;
    }
    static getUniqueId() {
        return this.latestId++;
    }
}

const getStoredKeys = () => [...Array(localStorage.length).keys()].map(i => localStorage.key(i));

const getB62FromKeyVal = (key, value) => {
    return decToB62([key, value].join(''));
};

const removeStoredInputKeys = () => getStoredKeys()
    .filter(skey => skey.match(/^\d{4}$/g))
    .map(k => { localStorage.removeItem(k)});

const getShareString = () => getStoredKeys()
        .filter(skey => skey.match(/^\d{4}$/g))
        .map(k => getB62FromKeyVal(k, localStorage.getItem(k)))
        .join('-');

const getKeyValFromB62 = b62 => {
    const decimalStr = b62ToDec(b62).toString(10);
    const key = decimalStr.slice(0,4);
    const value = decimalStr.slice(4);
    return [key, value];
};

const parseShareString = shareString => shareString.split('-').map(b62 => getKeyValFromB62(b62));

const autosaveProgress = () => {
    const dateString = new Date().toISOString().slice(0,10);
    const previousSetting = getSetting(PROGRAMSELECT_ID)(0);
    const stringToSave = getShareString();
    if (stringToSave.split('-').length > 1) {
        localStorage.setItem(`progress-${previousSetting}-${dateString}`, getShareString());
    }
};

const importFromShareString = (shareString) => {
    autosaveProgress();
    removeStoredInputKeys();
    parseShareString(shareString).map(row => saveSetting(row[0])(row[1]));
};

const saveSetting = elementId => value => localStorage.setItem(elementId, value);
const getSetting = elementId => defaultValue => {
    if (!localStorage.getItem(elementId)) {
        return defaultValue;
    }
    return localStorage.getItem(elementId);
};

const getUniqueProgramId = () => {
    let anId = 0;
    do {
        // Random int from 100 to 999, IDs 0-99 are reserved for built in programs
        anId = Math.floor(Math.random() * 900 + 100);
    } while (getStoredKeys().filter(k => k.match(new RegExp(`^program-${anId}`,"g"))).length > 0);
    return anId;
}

const saveProgram = (programName, shareString) => {
    const anId = `program-${getUniqueProgramId()}-${programName}`;
    localStorage.setItem(anId, shareString);
    return anId;
};

const getSavedPrograms = () => {
    const programList = getStoredKeys()
        .filter(skey => skey.match(/^program-/g))
        .map(k => ({
            id: Number(k.match(/^program-(\d+)/)[1]),
            title: k.match(/^program-\d+-(.+)/)[1],
            shareString: localStorage.getItem(k)
        }));
    return programList;
}

const getAllAvaliablePrograms = () =>  [...standardPrograms, ...getSavedPrograms()];

const getProgram = programId => getAllAvaliablePrograms().find(program => program.id == programId) ?? getProgram(0);

// ui
const getBrilliantElement = (type, classes, content) => {
    const element = document.createElement(type);
    element.classList.add(...classes);
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (Array.isArray(content)) {
        element.append(...content);
    } else if (typeof content === 'object') {
        element.appendChild(content);
    }
    return element;
};

const getBrilliantRow = headerCellsContent => getBrilliantElement('tr', [], headerCellsContent.map(content => getBrilliantElement('td', [], content)));
const getBrilliantHeaderRow = headerCellsContent => getBrilliantElement('tr', [], headerCellsContent.map(content => getBrilliantElement('th', [], content)));

const getBrilliantCheckBox = (ariaLabel) => {
    const element = document.createElement('input');
    element.id = IdCreator.getUniqueId();
    element.onchange = () => saveSetting(element.id)(element.checked ? 1 : 0);
    element.setAttribute('type', 'checkBox');
    element.checked = getSetting(element.id)(0) === '1';
    element.setAttribute('aria-label', ariaLabel);
    element.setAttribute('title', ariaLabel);
    return element;
}

const getBrilliantNumberInput = (min, max, step, value, ariaLabel) => {
    const element = document.createElement('input');
    if (max < 100 && step == 1) {
        element.classList.add('smallInput');
    }
    element.id = IdCreator.getUniqueId();
    element.onchange = () => saveSetting(element.id)(element.value);
    element.setAttribute('type', 'number'); 
    element.value = getSetting(element.id)(value);
    element.min = min;
    element.max = max;
    element.step = step;
    element.setAttribute('aria-label', ariaLabel);
    element.setAttribute('title', ariaLabel);
    return element;
};

const getBrilliantDisabledInput = (value, ariaLabel) => {
    const element = document.createElement('input');
    element.setAttribute('type', 'text');
    element.value = value;
    element.disabled = true;
    element.setAttribute('aria-label', ariaLabel);
    element.setAttribute('title', ariaLabel);
    return element;
};

class ShareContainer {
    static shareContainer = null;
    static getShareButton = () => {
        const shareLink = getBrilliantElement('button', ['loadSaveButton'], '💾 Load/save progress');
        shareLink.onclick = () => {
            this.shareContainer.dispatchEvent(new Event('toggleVisibility'));
            this.shareContainer.hidden = !this.shareContainer.hidden;
        }
        return shareLink;
    }
    static initShareContainer = () => {
        const hiddenShareLinkContainer = getBrilliantElement('div', ['shareLinkContainer']);
        hiddenShareLinkContainer.hidden = true;
        hiddenShareLinkContainer.addEventListener('toggleVisibility', () => { 
            while (hiddenShareLinkContainer.firstChild) {
                hiddenShareLinkContainer.removeChild(hiddenShareLinkContainer.firstChild);
            }
            const currentProgram = getSetting(PROGRAMSELECT_ID)(0);
            const regularExp = new RegExp(`progress-${currentProgram}`, "g");
            hiddenShareLinkContainer.append(
                ...getStoredKeys()
                    .filter(skey => skey.match(regularExp))
                    .sort()
                    .map(k => {
                        const dateString = k.substring(k.length - 10);
                        const shareStringContainer = getBrilliantElement('div', ['shareStringContainer'], getBrilliantElement('label', ['shareStringLabel'], dateString));
                        const removeButton = getBrilliantElement('button', ['clearButton'], '🗑');
                        removeButton.onclick = () => {
                            localStorage.removeItem(k);
                            hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
                        };
                        const textBoxWithString = getBrilliantElement('input', ['presentedlink'], '');
                        textBoxWithString.type = 'text';
                        textBoxWithString.value = localStorage.getItem(k);
                        const copyLinkButton = getBrilliantElement('button', [], 'Copy');
                        copyLinkButton.onclick = () => {
                            textBoxWithString.select();
                            document.execCommand("copy");
                        };
                        const restoreButton = getBrilliantElement('button', [], 'Restore');
                        restoreButton.onclick = () => {
                            importFromShareString(textBoxWithString.value);
                            ProgramContainer.renderProgram();
                        };
                        shareStringContainer.append(removeButton, textBoxWithString, copyLinkButton, restoreButton);
                        return shareStringContainer;
                    }
                )
            );
            const shareStringContainer = getBrilliantElement('div', ['shareStringContainer']);
            const saveSerializedButton = getBrilliantElement('button', [], 'Save current');
            saveSerializedButton.onclick = () => {
                autosaveProgress();
                hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
            }
            const hideSettingsButton = getBrilliantElement('button', ['closebutton'], '▲ ▲ ▲');
            hideSettingsButton.onclick = () => { hiddenShareLinkContainer.hidden = !hiddenShareLinkContainer.hidden; };
            shareStringContainer.append(saveSerializedButton);
            hiddenShareLinkContainer.append(shareStringContainer, hideSettingsButton);
        });
        this.shareContainer = hiddenShareLinkContainer;
    };
}

const getBrilliantAnchorLinkList = programScheme => {
    const iterations = [...Array(programScheme.numberOfIterations).keys()];
    const linkList = getBrilliantElement('div', ['linkList'], iterations.map(iteration => {
        const anchorbuttonContainer = getBrilliantElement('div', ['tightdiv', 'weekelement']);
        const link = getBrilliantElement('button', ['cyclelink'], `Week${iteration + 1}`);
        const dayButtonList = getBrilliantElement('div', ['dayButtonList'])
        dayButtonList.append(...[...Array(programScheme.days.length).keys()].map(dayIndex => {
            const dayButton = getBrilliantElement('button', ['dayButton'], `Day ${dayIndex + 1}`);
            dayButton.onclick = () => {
                document.querySelector(`#day${iteration}-${dayIndex}`).scrollIntoView({
                    behavior: 'smooth'
                });
                dayButtonList.hidden = true;
            };
            return dayButton;
        }));
        dayButtonList.hidden = true;
        anchorbuttonContainer.append(link, dayButtonList);
        link.onclick = () => {
            dayButtonList.hidden = !dayButtonList.hidden;
        }
        return anchorbuttonContainer;
    }));
    
    return linkList;
};

// +------------+----------+----+------------------+----+--------------------+
// |     .      |  Week1   | -> |      Week2       | -> |       Week3        |
// +------------+----------+----+------------------+----+--------------------+
// | Movement 1 | squat    | -> | squat            | -> | squat              |
// | Movement 2 | bench    | -> | larsen (changed) | -> | larsen             |
// | Movement 3 | deadlift | -> | deadlift         | -> | stiffleg (changed) |
// +------------+----------+----+------------------+----+--------------------+
// changes on movement on week2 cascades to week3, week4 etc.
const getMovementSelect = (defaultvalue, cascadeId) => {
    const selectElement = getBrilliantElement('select', ['movementselect']);
    selectElement.setAttribute('cascade', cascadeId);
    selectElement.id = IdCreator.getUniqueId(); //identifier;
    const selectedvalue = getSetting(selectElement.id)(defaultvalue);
    selectElement.onchange = () => {
        saveSetting(selectElement.id)(selectElement.value);
        const cascadingElements = document.querySelectorAll(`select[cascade$=${CSS.escape(cascadeId.slice(1))}]`);
        [...cascadingElements].filter(cElement => cElement.getAttribute('cascade')[0] > cascadeId[0]).map(cElement => {
            cElement.value = selectElement.value;
            saveSetting(cElement.id)(selectElement.value);
        });
    };
    const optGroups = movements.map(group => {
        const optGroup = getBrilliantElement('optgroup', [], group.movements.map(movement => {
            const moption = getBrilliantElement('option', [], movement.label);
            moption.value = movement.mid;
            if (movement.mid == selectedvalue) {
                moption.selected = true;
            }
            return moption;
        }));
        optGroup.label = group.group;
        return optGroup;
    });
    selectElement.append(...optGroups);
    return selectElement;
};

const getDumbMovementSelect = (defaultvalue) => {
    const selectElement = getBrilliantElement('select', ['dumbmovementselect']);
    const optGroups = movements.map(group => {
        const optGroup = getBrilliantElement('optgroup', [], group.movements.map(movement => {
            const moption = getBrilliantElement('option', [], movement.label);
            moption.value = movement.mid;
            if (movement.mid == defaultvalue) {
                moption.selected = true;
            }
            return moption;
        }));
        optGroup.label = group.group;
        return optGroup;
    });
    selectElement.append(...optGroups);
    return selectElement;
};

const getSessionMovementTable = (currentIteration, dayIndex, movements) => {
    const dayContainer = getBrilliantElement('fieldset', ['dayContainer'], getBrilliantElement('legend', [], `Day ${dayIndex + 1}`));
    dayContainer.id = `day${currentIteration}-${dayIndex}`;
    dayContainer.append(
        ...movements.map(((movement, movementIndex) => {
            const _setRefs = [];
            const sets = movement.sets.map(s => Array(s.repeat(currentIteration)).fill(s)).flat(); // [1,3,2] => [1,3,3,3,2,2]
            const movementTable = getBrilliantElement('table', ['movementContainer'], [
                getBrilliantElement('caption', [], getMovementSelect(movement.movementId, `${currentIteration}-${dayIndex}${movementIndex}`)),
                getBrilliantHeaderRow(['', 'Reps', 'Goal RPE', '% of e1RM', 'Weight', 'Actual RPE', 'e1RM']),
                ...sets.map((set, setIndex) => {
                    const reps = getBrilliantNumberInput(0, 10, 1, set.reps(currentIteration), `Reps for set ${setIndex +1}`);
                    const perc = getBrilliantDisabledInput((set.perc(currentIteration) !== null) ? `${set.perc(currentIteration)}%` : null, `Percentage for set ${setIndex +1}`);
                    const weight = (set.perc(currentIteration) !== null) 
                        ? getBrilliantDisabledInput(set.weight(currentIteration), `Weight for set ${setIndex +1}`) 
                        : getBrilliantNumberInput(75, 1000, 2.5, set.weight(currentIteration), `Weight for set ${setIndex +1}`);
                    const actualRpe = getBrilliantNumberInput(1, 11, 0.25, set.rpe(currentIteration), `Actual RPE for set ${setIndex +1}`);
                    const plannedRpe = getBrilliantDisabledInput(set.rpe(currentIteration), `Goal RPE for set ${setIndex +1}`);
                    const e1rm = getBrilliantDisabledInput('...', `Estimated 1RM for set ${setIndex +1}`);
                    if (set.perc(currentIteration) !== null) {
                        const updateByHighestE1rm = () => {
                                const settingsMax = ProgramSettingsContainer.movementsMaxMap.get(movement.movementId) ?? 0;
                                const highestE1rm = 
                                    _setRefs.reduce((cMax, s) => Math.max(Number(cMax), Number(s.value)), settingsMax);
                                const percentage = (typeof set.perc === 'function') ? set.perc(currentIteration) : Number(set.perc);
                                weight.value = presentableWeightValue((percentage * highestE1rm)/100);
                        };
                        updateByHighestE1rm();
                        _setRefs.map(setRef => setRef.addEventListener('change', updateByHighestE1rm))
                        if (ProgramSettingsContainer.movementsMaxInputMap.has(movement.movementId)) {
                            ProgramSettingsContainer.movementsMaxInputMap.get(movement.movementId).addEventListener('change', updateByHighestE1rm);
                        }
                    };
                    _setRefs.push(e1rm);
                    const session1rm = () => (weight.value && reps.value && actualRpe.value) ? oneRepMax(Number(weight.value))(Number(reps.value))(Number(actualRpe.value)) : null;
                    e1rm.value = presentableWeightValue(session1rm());
                    [reps, weight, actualRpe].map(inputElement => inputElement.addEventListener('input', () => {
                        e1rm.value = presentableWeightValue(session1rm());
                        e1rm.dispatchEvent(new Event('change'));
                    }));
                    
                    return getBrilliantRow([getBrilliantCheckBox(`Checkbox indicating done set for set ${setIndex +1}`), reps, plannedRpe, perc, weight, actualRpe, e1rm]);
                }).flat()
            ]);
            
            return movementTable;
        })),
        getRestDayText(movements)
    );
    return dayContainer;
};

const getRestDayText = day => {
    const restDayText = getBrilliantElement('h2', ['restDayText'], 'Rest day');
    restDayText.hidden = day.length > 0;
    return restDayText;
}

const getBrilliantDateInput = (value) => {
    const element = document.createElement('input');
    element.id = IdCreator.getUniqueId();
    element.onchange = () => saveSetting(element.id)(element.valueAsNumber/100000);
    element.setAttribute('type', 'date');
    const useValue = getSetting(element.id)(value)*100000;
    if (useValue) element.valueAsNumber = useValue;
    return element;
}

class ProgramSettingsContainer {
    static programSettingsContainer = getBrilliantElement('div', ['programSettingsContainer']);
    static toggleVisibility = () => {
        this.programSettingsContainer.hidden = !this.programSettingsContainer.hidden;
    }
    static getProgramSettingsButton = () => {
        const programSettingsLink = getBrilliantElement('button', ['settingsMenuButton'], '🛠');
        programSettingsLink.onclick = () => {
            this.toggleVisibility();
        }
        return programSettingsLink;
    }
    static movementsMaxMap = new Map();
    static movementsTitleMap = new Map(movements.map(group => group.movements.map(mov => [mov.mid, mov.label])).flat());
    static movementsMaxInputMap = new Map();
    static initProgramSettingsContainer = (programSetUp, isEditable) => {
        // whipe program maps
        this.movementsMaxInputMap = new Map();
        this.movementsMaxMap = new Map();
        const programSettingsContainer = getBrilliantElement('div', ['programSettingsContainer']);
        programSettingsContainer.id = 'programSettings';

        // Movement Maxes
        const movementsOptionalMax = programSetUp.days.map(day => day
            .filter(movement => movement.sets.some(set => set.rpe(1) !== null && set.reps(1) !== null))
            .map(movement => movement.movementId))
            .flat();
        const movementsWithRequiredMax = programSetUp.days.map(day => day
            .filter(movement => movement.sets.every(set => set.rpe(1) === null || set.reps(1) === null))
            .map(movement => movement.movementId))
            .flat();

        ShareContainer.initShareContainer();
        const cleanSlate = getBrilliantElement('button', ['clearButton'], '🗑 Reset Progress');
        cleanSlate.onclick = () => {
            const currentProgramId = getSetting(PROGRAMSELECT_ID)();
            removeStoredInputKeys();
            saveSetting(PROGRAMSELECT_ID)(currentProgramId);
            ProgramContainer.renderProgram();
        };
        
        programSettingsContainer.append(...[{title: "Required e1RMs", movs: movementsWithRequiredMax}, {title: "Optional e1RMs", movs:movementsOptionalMax}].map(movementList => 
            (movementList.movs.length > 0) 
                ? getBrilliantElement('table', ['settingsTable'], [
                    getBrilliantElement('caption', [], `${movementList.title}:`),
                    getBrilliantHeaderRow([
                    'Movment', 'e1RM'
                    ]),
                    ...movementList.movs.map(movementId => {
                        const maxWeightInput = getBrilliantNumberInput(75, 1000, 2.5);
                        maxWeightInput.addEventListener('change', () => {
                            this.movementsMaxMap.set(movementId, maxWeightInput.value);
                        })
                        this.movementsMaxInputMap.set(movementId, maxWeightInput);
                        this.movementsMaxMap.set(movementId, maxWeightInput.value);
                        return getBrilliantRow([
                            this.movementsTitleMap.get(movementId),
                            maxWeightInput
                        ]);
                    })
                ])
                : null
            ).filter(element => element !== null),
            ShareContainer.getShareButton(),
            ShareContainer.shareContainer,
            cleanSlate
        );
        if (isEditable) {
            programSettingsContainer.append(ProgramEditor.getProgramEditorButton());
        }
        if (movementsWithRequiredMax.length == 0 
            || [...this.movementsMaxInputMap.keys()]
                .filter(maxKey => movementsWithRequiredMax.includes(maxKey))
                .every(maxKey => this.movementsMaxInputMap.get(maxKey).value > 0)) {
            programSettingsContainer.hidden = true;
        }
        const hideSettingsButton = getBrilliantElement('button', ['closebutton'], '▲ ▲ ▲');
        hideSettingsButton.onclick = this.toggleVisibility;
        programSettingsContainer.append(
            hideSettingsButton
        );

        this.programSettingsContainer = programSettingsContainer;
    }
}

class ProgramEditor {
    static programEditorContainer = null;
    static toggleVisibility = () => {
        this.programEditorContainer.hidden = !this.programEditorContainer.hidden;
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    static getNewProgramButton = () => {
        const button = getBrilliantElement('button', ['createNewProgramButton'], 'Create new program');
        button.onclick = () => {
            autosaveProgress();
            removeStoredInputKeys();
            ProgramContainer.renderProgram({title: "New program", shareString: "ks00000000000000"}, false);
        };
        return button;
    }
    static getProgramEditorButton = () => {
        const button = getBrilliantElement('button', ['menuButton'], '📝Edit Program');
        button.onclick = () => {
            this.toggleVisibility();
            ProgramSettingsContainer.programSettingsContainer.hidden = true;
        };
        return button;
    }
    static initProgramEditorContainer = rawProgramSetUp  => {
        // const rawProgram = fillSetParams(parseSharableProgram(title, shareString));
        const rawProgram = parseSharableProgram(rawProgramSetUp.title, rawProgramSetUp.shareString);
        const programEditorContainer = getBrilliantElement('div', ['programEditorContainer']);
        const setMutationInput = (mutateObject, mutateProperty, input) => {
            input.value = (input.type === 'text') ? mutateObject[mutateProperty] : Number(mutateObject[mutateProperty]);
            input.addEventListener('change', () => {
                mutateObject[mutateProperty] = input.value;
            });
        }
        const hideEditorButton = getBrilliantElement('button', ['closebutton'], '▲ ▲ ▲');
        hideEditorButton.onclick = this.toggleVisibility;
        const titleField = getBrilliantElement('input', []);
        titleField.setAttribute('type', 'text');
        setMutationInput(rawProgram, 'title', titleField);
        titleField.value = rawProgram.title;
        const numberOfIterationsField = getBrilliantElement('input', []);
        numberOfIterationsField.setAttribute('type', 'number');
        numberOfIterationsField.addEventListener('change', () => allDaysContainer.dispatchEvent(new Event('render')));
        setMutationInput(rawProgram, 'numberOfIterations', numberOfIterationsField);
        const numberOfDaysField = getBrilliantElement('input', []);
        numberOfDaysField.setAttribute('type', 'number');
        numberOfDaysField.onchange = () => {
            if (numberOfDaysField.value <= rawProgram.days.length) {
                rawProgram.days = rawProgram.days.slice(0, numberOfDaysField.value);
            } else if (numberOfDaysField.value <= 10) {
                rawProgram.days.push(
                    ...Array(numberOfDaysField.value - rawProgram.days.length).fill([])
                );
            }
            
            allDaysContainer.dispatchEvent(new Event('render'));
        };
        numberOfDaysField.value = rawProgram.days.length;
        programEditorContainer.append(
            hideEditorButton,
            getBrilliantElement('div', ['editorFieldBox'], [
                getBrilliantElement('label', [], 'Title'),
                titleField
            ]),
            getBrilliantElement('div', ['editorFieldBox'], [
                getBrilliantElement('label', [], 'Number of iterations/weeks'),
                numberOfIterationsField
            ]),
            getBrilliantElement('div', ['editorFieldBox'], [
                getBrilliantElement('label', [], 'Number of days per week'),
                numberOfDaysField
            ])
        );
        const renderParamBox = (params, paramLabels) => {
            const container = getBrilliantElement('div', ['paramsContainer']);
            const filler = Array(paramLabels.length).fill();
            const paramInputs = filler.map((_, paramIndex) => {
                const paramInput = getBrilliantElement('input', ['paramInput']);
                paramInput.setAttribute('type', 'number');
                paramInput.min = -1000;
                paramInput.max = 1000;
                paramInput.step = 0.25;
                setMutationInput(params, paramIndex, paramInput);
                // paramInput.value = params[paramIndex];
                return getBrilliantElement('div', ['paramBox'], [
                    getBrilliantElement('label', [], paramLabels[paramIndex]),
                    paramInput
                ]);
            });
            container.append(...paramInputs);
            return container;
        }
        const progressionBoxes = new Map([
            [PROGRESSION_NONE, {
                optionLabel: "None",
                nrOfParams: 0
            }],
            [PROGRESSION_LINEAR, {
                optionLabel: "Linear",
                nrOfParams: 2
            }],
            [PROGRESSION_CONSTANT, {
                optionLabel: "Constant",
                nrOfParams: 1
            }],
            [PROGRESSION_STEPS, {
                optionLabel: "Steps",
                nrOfParams: rawProgram.numberOfIterations
            }],
        ]);
        const getDeleteSetButton = (setContainer, movement, setIndex) => {
            const button = getBrilliantElement('button', ['clearButton'], '🗑');
            button.onclick = () => {
                setContainer.remove();
                movement.sets.splice(setIndex, 1);
                allDaysContainer.dispatchEvent(new Event('render'));
            };
            return button;
        };
        const getAddSetButton = (movement) => {
            const button = getBrilliantElement('button', [], 'Add set');
            button.onclick = () => {
                movement.sets.push({
                    // reps: {type: PROGRESSION_CONSTANT, params: []}
                });
                allDaysContainer.dispatchEvent(new Event('render'));
            };
            return button;
        };
        const getCopySetButton = (movement, set, setIndex) => {
            const button = getBrilliantElement('button', [], 'Copy set');
            button.onclick = () => {
                movement.sets.splice(setIndex, 0, JSON.parse(JSON.stringify(set)));
                allDaysContainer.dispatchEvent(new Event('render'));
            };
            return button;
        }
        const getDeleteMovementButton = (movementContainer, day, movementIndex) => {
            const button = getBrilliantElement('button', ['clearButton'], '🗑');
            button.onclick = () => {
                movementContainer.remove();
                day.splice(movementIndex, 1);
                allDaysContainer.dispatchEvent(new Event('render'));
            };
            return button;
        };
        const getAddMovementButton = (day) => {
            const button = getBrilliantElement('button', [], 'Add movement');
            button.onclick = () => {
                day.push({
                    movementId: 0,
                    sets: [{
                        // reps: {type: PROGRESSION_CONSTANT, params: []}
                    }]
                });
                allDaysContainer.dispatchEvent(new Event('render'));
            };
            return button;
        }
        const getAddProgressionButton = (set, setParamType) => {
            const button = getBrilliantElement('button', ['addParamButton'], setParamLabels[setParamType]);
            button.onclick = () => {
                set[setParamType] = {type: PROGRESSION_CONSTANT, params: []};
                allDaysContainer.dispatchEvent(new Event('render'));
            };
            return button;
        }
        // const getDeleteDayButton = (dayContainer, program, dayIndex) => {
        //     const button = getBrilliantElement('button', ['clearButton'], '🗑');
        //     button.onclick = () => {
        //         dayContainer.remove();
        //         program.days.splice(dayIndex, 1);
        //         allDaysContainer.dispatchEvent(new Event('render'));
        //     };
        //     return button;
        // }
        // const getAddDayButton = (program) => {
        //     const button = getBrilliantElement('button', [], 'Add day');
        //     button.onclick = () => {
        //         program.days.push([{
        //             movementId: 0,
        //             sets: [{
        //                 reps: {type: PROGRESSION_NONE, params: []},
        //                 rpe: {type: PROGRESSION_NONE, params: []},
        //                 perc: {type: PROGRESSION_NONE, params: []},
        //                 weight: {type: PROGRESSION_NONE, params: []},
        //                 repeat: {type: PROGRESSION_NONE, params: []}
        //             }]
        //         }]);
        //         allDaysContainer.dispatchEvent(new Event('render'));
        //     };
        //     return button;
        // }
        // const getToggleVisibilityButton = (container) => {
        //     const button = getBrilliantElement('button', [], "");
        //     button.textContent = (container.hidden) ? "Show" : "Collapse";
        //     button.onclick = () => {
        //         container.hidden = !container.hidden;
        //         button.textContent = (container.hidden) ? "Show" : "Collapse";
        //     }
        //     return button;
        // };
        
        const allDaysContainer = getBrilliantElement('div', ['allDaysContainer']);
        allDaysContainer.addEventListener('render', event => {
            while (allDaysContainer.firstChild) {
                allDaysContainer.removeChild(allDaysContainer.firstChild);
            }
            allDaysContainer.append(
                ...rawProgram.days.map((day, dayIndex) => {
                    const dayContainer = getBrilliantElement('fieldset', ['dayEditContainer']);
                    const dayEditDiv = getBrilliantElement('div', ['innerDayEdit'], [
                        ...day.map((movement, movementIndex) => {
                            const movementCointainter = getBrilliantElement('div', ['movementEditContainer']);
                            const setContainers = movement.sets.map((set, setIndex) => {
                                const setContainer = getBrilliantElement('div', ['setContainer']);
                                setContainer.append(
                                    getBrilliantElement('h3', [], `Set ${setIndex +1}`),
                                    getDeleteSetButton(setContainer, movement, setIndex),
                                    ...Object.entries(set)
                                        .filter(([pKey, pValue]) => pValue.type != PROGRESSION_NONE)
                                        .map(([pKey, pValue]) => {
                                        const progressionContainer =  getBrilliantElement('div', ['progressionContainer']);
                                        const progressionSelect = getBrilliantElement('select', ['progressionSelect']);
                                        const progressionEditor = getBrilliantElement('div', ['progressionEditor']);
                                        progressionBoxes.forEach((pObj, pType) => {
                                            const progressionOption = getBrilliantElement('option', [], pObj.optionLabel);
                                            progressionOption.value = pType;
                                            if (pType === pValue.type) {
                                                progressionOption.selected = true;
                                            }
                                            progressionSelect.append(progressionOption);
                                        });
                                        setMutationInput(pValue, 'type', progressionSelect);
                                        progressionSelect.addEventListener('change', () => {
                                            while (progressionEditor.firstChild) {
                                                progressionEditor.removeChild(progressionEditor.firstChild);
                                            }
                                            const progressionParamLabels = new Map([
                                                [PROGRESSION_NONE, []],
                                                [PROGRESSION_LINEAR, ['initial', 'change']],
                                                [PROGRESSION_CONSTANT, ['value']],
                                                [PROGRESSION_STEPS, Array(5).fill().map((f, i) => `step ${i +1}`)],
                                            ]);
                                            progressionEditor.append(
                                                renderParamBox(
                                                    pValue.params, 
                                                    progressionParamLabels.get(Number(progressionSelect.value))
                                                )
                                            );
                                        });
                                        progressionSelect.dispatchEvent(new Event('change'));
                                        const deleteProgressionButton = getBrilliantElement('button', ['clearButton'], '🗑');
                                        deleteProgressionButton.onclick = () => {
                                            delete set[pKey];
                                            allDaysContainer.dispatchEvent(new Event('render'));
                                        }
                                        progressionContainer.append(
                                            getBrilliantElement('label', ['progressionLabel'], setParamLabels[pKey]),
                                            progressionSelect,
                                            progressionEditor,
                                            deleteProgressionButton
                                        );
                                        return progressionContainer;
                                    }),
                                    getBrilliantElement('div', ['setParamButtonList'],
                                        Object.keys(setParams)
                                        .filter(setParam => !Object.keys(set).includes(setParam))
                                        .map(setParam => getAddProgressionButton(set, setParam))),
                                    getCopySetButton(movement, set, setIndex)
                                );
                                return setContainer;
                            });
                            const movementSelect = getDumbMovementSelect(movement.movementId);
                            setMutationInput(movement, 'movementId', movementSelect);
                            movementCointainter.append(
                                getBrilliantElement('h3', [], `Movement ${movementIndex +1}`),
                                getDeleteMovementButton(movementCointainter, day, movementIndex),
                                movementSelect,
                                ...setContainers,
                                getAddSetButton(movement)
                            );
                            return movementCointainter;
                        }),
                        getRestDayText(day),
                        getAddMovementButton(day)
                    ]);
                    dayContainer.append(
                        getBrilliantElement('legend', ['dayEditLegend'], [
                            `Day ${dayIndex +1}`, 
                            // getToggleVisibilityButton(dayEditDiv)
                            // getDeleteDayButton(dayContainer, rawProgram, dayIndex)
                        ]),
                        dayEditDiv
                    );
                    return dayContainer; 
                }),
                // getAddDayButton(rawProgram)
            )
        });
        allDaysContainer.dispatchEvent(new Event('render'));

        programEditorContainer.append(allDaysContainer);

        const renderButton = getBrilliantElement('button', [], 'Save and render program');
        renderButton.onclick = () => {
            const shareString = getSharableProgram(rawProgram);
            // console.log(shareString);
            const possibleExistingId = `program-${rawProgramSetUp.id}-${rawProgram.title}`;
            const existing = localStorage.getItem(possibleExistingId);
            if (existing) {
                localStorage.setItem(possibleExistingId, shareString);
            } else {
                const newId = saveProgram(rawProgram.title, shareString);
                saveSetting(PROGRAMSELECT_ID)(newId);
            }
            
            ProgramContainer.renderProgram({title: rawProgram.title, shareString: shareString});
        }
        programEditorContainer.append(renderButton);
        programEditorContainer.hidden = (rawProgram.days.every(day => day.length == 0)) ? false : true;
        this.programEditorContainer = programEditorContainer;
    }
}

class ProgramSelector {
    static selectProgramContainer = getBrilliantElement('div', ['selectProgramContainer']);
    static getSelectProgramButton = () => {
        const button = getBrilliantElement('button', ['settingsMenuButton'], '≡');
        button.onclick = () => {
            this.selectProgramContainer.hidden = !this.selectProgramContainer.hidden;
        }
        return button;
    }
    static getProgramSelectRow = (programScheme, canEdit=false) => {
        const row = getBrilliantElement('div', ['programSelectRow']);
        const goToButton = getBrilliantElement('button', ['selectProgramButton'], programScheme.title);
        goToButton.onclick = () => {
            autosaveProgress();
            removeStoredInputKeys();
            saveSetting(PROGRAMSELECT_ID)(programScheme.id);
            ProgramContainer.renderProgram(getProgram(programScheme.id));
        }
        const editButton = getBrilliantElement('button', ['selectProgramButton'], '📝');
        editButton.onclick = () => {
            autosaveProgress();
            removeStoredInputKeys();
            ProgramContainer.renderProgram(programScheme, false);
            ProgramEditor.toggleVisibility();
            ProgramSettingsContainer.programSettingsContainer.hidden = true;
        }
        const copyButton = getBrilliantElement('button', ['selectProgramButton'], '⧉');
        copyButton.onclick = () => {
            autosaveProgress();
            removeStoredInputKeys();
            ProgramContainer.renderProgram({title: `Copy of ${programScheme.title}`, shareString: programScheme.shareString}, false);
            ProgramEditor.toggleVisibility();
            ProgramSettingsContainer.programSettingsContainer.hidden = true;
        }
        const deleteButton = getBrilliantElement('button', ['selectProgramButton'], '🗑');
        deleteButton.onclick = () => {
            localStorage.removeItem(`program-${programScheme.id}-${programScheme.title}`);
            row.remove();
        }
        if (canEdit) {
            row.append(
                goToButton,
                getBrilliantElement('div', ['buttonList'], [deleteButton, editButton, copyButton])
            );
        } else {
            row.append(
                goToButton,
                getBrilliantElement('div', ['buttonList'], [copyButton])
            );
        }
        
        return row;
    }
    static initProgramSelect = () => {
        const selectProgramContainer = getBrilliantElement('div', ['selectProgramContainer']);
        selectProgramContainer.hidden = true;
        selectProgramContainer.append(
            ...standardPrograms.map(programScheme => this.getProgramSelectRow(programScheme)),
            ...getSavedPrograms().map(programScheme => this.getProgramSelectRow(programScheme, true)),
            ProgramEditor.getNewProgramButton()
        );

        this.selectProgramContainer = selectProgramContainer;
    }
}

const PROGRESSION_LINEAR = 1;
const PROGRESSION_CONSTANT = 2;
const PROGRESSION_NONE = 3;
const PROGRESSION_STEPS = 4;
const progressions = {
    linear: (...params) => iteration => params[0] + params[1] * iteration,
    constant: (...params) => iteration => params[0],
    none: (...params) => iteration => null,
    steps: (...params) => iteration => params[iteration % params.length]
};

const getProgressionFormula = progressionTemplate => {
    if (typeof progressionTemplate === 'function') {
        return progressionTemplate;
    }
    if (typeof progressionTemplate === "undefined") {
        return progressions.none();
    }
    if (progressionTemplate == null) {
        return progressions.none();
    }
    if (typeof progressionTemplate === "number") {
        return progressions.constant(progressionTemplate);
    }
    if (typeof progressionTemplate === "object") {
        if (progressionTemplate.type === PROGRESSION_LINEAR) {
            return progressions.linear(...progressionTemplate.params);
        }
        if (progressionTemplate.type === PROGRESSION_CONSTANT) {
            return progressions.constant(...progressionTemplate.params);
        }
        if (progressionTemplate.type === PROGRESSION_NONE) {
            return progressions.none();
        }
        if (progressionTemplate.type === PROGRESSION_STEPS) {
            return progressions.steps(...progressionTemplate.params);
        }
    }
    return progressions.none();
}

const fillSetParams = rawProg => ({
    numberOfIterations: rawProg.numberOfIterations,
    title: rawProg.title,
    days: rawProg.days.map(day => day.map(movement => ({
        movementId: movement.movementId,
        sets: movement.sets.map(set => ({
            reps: set.hasOwnProperty('reps') ? set.reps : {type: PROGRESSION_NONE, params: []},
            rpe: set.hasOwnProperty('rpe') ? set.rpe : {type: PROGRESSION_NONE, params: []},
            perc: set.hasOwnProperty('perc') ? set.perc : {type: PROGRESSION_NONE, params: []},
            weight: set.hasOwnProperty('weight') ? set.weight : {type: PROGRESSION_NONE, params: []},
            repeat: set.hasOwnProperty('repeat') ? set.repeat : {type: PROGRESSION_NONE, params: []},
        }))
    })))
});

const readyProgram = rawProg => ({
    numberOfIterations: rawProg.numberOfIterations,
    title: rawProg.title,
    days: rawProg.days.map(day => day.map(movement => ({
        movementId: movement.movementId,
        sets: movement.sets.map(set => ({
            reps: getProgressionFormula(set.reps),
            rpe: getProgressionFormula(set.rpe),
            perc: getProgressionFormula(set.perc),
            weight: getProgressionFormula(set.weight),
            repeat: (set.repeat == null || typeof set.repeat == "undefined") ? progressions.constant(1) : getProgressionFormula(set.repeat)
        }))
    })))
});

const setParams = {
    reps: 1,
    rpe: 2,
    perc: 3,
    weight: 4,
    repeat: 5,
};

const setParamLabels = {
    reps: 'Reps',
    rpe: 'RPE',
    perc: 'Percentage',
    weight: 'Weight',
    repeat: 'Repeat',
};

const convertRawProgressionToArray = (typeId, rawProgression) => 
    (typeof rawProgression == 'object' && rawProgression.type != PROGRESSION_NONE) 
    ? [typeId,
        1, // serves as length in parser
        rawProgression.type,
        rawProgression.params.length,
        rawProgression.params]//.map(param => (param < 0) ? `+${Math.abs(param)}`: param)]
    : [];

const getSharableProgram = rawProg => [
    rawProg.numberOfIterations, // serves as id in parser
    rawProg.days.length,
    rawProg.days.map(day => [
        0, // serves as id in parser
        day.length,
        day.map(movement => [
            movement.movementId,
            movement.sets.length,
            movement.sets.map(set => [
                0, // serves as id in parser
                Object.values(set).filter(s => s.type != PROGRESSION_NONE).length,
                ...convertRawProgressionToArray(setParams.reps, set.reps),
                ...convertRawProgressionToArray(setParams.rpe, set.rpe),
                ...convertRawProgressionToArray(setParams.perc, set.perc),
                ...convertRawProgressionToArray(setParams.weight, set.weight),
                ...convertRawProgressionToArray(setParams.repeat, set.repeat),
            ])
        ])
    ])
].flat(8).map(n => decToB62(n)).map(e => (e.length > 1) ? `-${e.length}${e}` : e).join('');

const parseShortened = d => d.split(/(?=-)/g).map(chunk => (chunk[0] === '-') ? [chunk.slice(2,2+Number(chunk[1])), ...chunk.slice(2+Number(chunk[1])).split('')] : chunk.split('')).flat();

const parseSharableProgram = (title, shareProgram) => {
    const atoms = parseShortened(shareProgram).map(atom => b62ToDec(atom));
    const parseDays = (nrOfDays, data) => {
        const allCounters = [0,0,0,0,0,0,nrOfDays];
        const result = [];
        let findCounter = false;
        let findId = true;
        data.forEach(value => {
            const level = allCounters.findIndex(counter => counter > 0);
            if (findId) { 
                if (level == 6) result.push([value]);
                else if (level == 5) result.at(-1).push([value]);
                else if (level == 4) result.at(-1).at(-1).push([value]);
                else if (level == 3) result.at(-1).at(-1).at(-1).push([value]);
                else if (level == 2) result.at(-1).at(-1).at(-1).at(-1).push([value, []]);
                else if (level == 1) result.at(-1).at(-1).at(-1).at(-1).at(-1).push([value, []]);
                else if (level == 0) result.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push([value, []]);
                findId = false;
                findCounter = true;
            } else if (level > -1) {
                if (findCounter) {
                    allCounters[level-1] = value;
                    findCounter = false;
                    findId = level > 2;
                } else {
                    if (level == 6) result.at(-1).push([value]);
                    else if (level == 5) result.at(-1).at(-1).push(value);
                    else if (level == 4) result.at(-1).at(-1).at(-1).push(value);
                    else if (level == 3) result.at(-1).at(-1).at(-1).at(-1).push(value);
                    else if (level == 2) result.at(-1).at(-1).at(-1).at(-1).at(-1).push(value);
                    else if (level == 1) result.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push(value);
                    else if (level == 0) result.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push(value)
                }
                --allCounters[level];
                if (allCounters.slice(0,level+1).every(v => v==0)) {
                    findCounter = true;
                    findId = true;
                }
            }
        });
        return result;
    };
    const parseProgression = data => ({
        type: data[0][0],
        params: data[0].slice(1).flat()
    });
    return {
        numberOfIterations: atoms[0],
        title: title,
        days: parseDays(atoms[1],atoms.slice(2))
            .filter(day => typeof day === 'object' && day.length > 0)
            .map(day => (day.filter(movement => typeof movement === 'object' && movement.length > 0).map(movement => ({
                movementId: movement[0],
                sets: movement.slice(1)
                    .filter(set => typeof set === 'object' && set.length > 0)
                    .map(set => {
                        const setObj = {};
                        set.slice(1).map(setParam => {
                            if (setParam[0] == setParams.reps) setObj.reps = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.rpe) setObj.rpe = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.perc) setObj.perc = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.weight) setObj.weight = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.repeat) setObj.repeat = parseProgression(setParam.slice(1));
                        });
                        return setObj;
                    })
            }))))
    }
}

class ProgramContainer {
    static appContainer = getBrilliantElement('div', ['appContainer']);
    static first = true;
    static renderProgram(sharedProgramSetUp, doRenderBody=true) {
        IdCreator.resetId();
        while (this.appContainer.firstChild) {
            this.appContainer.removeChild(this.appContainer.firstChild);
        }
        window.scrollTo({top: 0});
        let rawProgramSetUp = getProgram(getSetting(PROGRAMSELECT_ID)(0));
        if (typeof sharedProgramSetUp === 'object') {
            rawProgramSetUp = sharedProgramSetUp;
        }
        const rawProg = parseSharableProgram(rawProgramSetUp.title, rawProgramSetUp.shareString);
        ProgramEditor.initProgramEditorContainer(rawProgramSetUp);
        const isEditable = !standardPrograms.some(standardProg => standardProg.id === rawProgramSetUp.id);
        const programSetUp = readyProgram(rawProg);
        ProgramSettingsContainer.initProgramSettingsContainer(programSetUp, isEditable);

        const programContainer = getBrilliantElement('div', ['programContainer']);
        if (doRenderBody) {
        const iterations = [...Array(programSetUp.numberOfIterations).keys()];
            programContainer.append(
                ...iterations.map(currentIteration => {
                    const cycleHeader = getBrilliantElement('h2', ['weekHeader'], `Week ${currentIteration + 1}`)
                    const cycleContainer = getBrilliantElement('div', ['blockContainer', 'weekelement'], cycleHeader);
                    cycleContainer.id = `cycle${currentIteration}`;
                    cycleContainer.append(
                        ...programSetUp.days.map((movements, index) => getSessionMovementTable(currentIteration, index, movements))
                    );
                    return cycleContainer;
                })
            );
        }

        const headerContainer = getBrilliantElement('div', ['headerContainer']);
        ProgramSelector.initProgramSelect();
        headerContainer.append(
            getBrilliantElement('div', ['titleBar'], [
                getBrilliantElement('div', ['selectorDiv'], [
                    ProgramSelector.getSelectProgramButton(),
                    ProgramSelector.selectProgramContainer,
                ]),
                getBrilliantElement('h1', ['programHeader'], rawProgramSetUp.title),
                ProgramSettingsContainer.getProgramSettingsButton()
            ]),
            getBrilliantAnchorLinkList(programSetUp),
            ProgramSettingsContainer.programSettingsContainer
        );
        this.appContainer.append(headerContainer, ProgramEditor.programEditorContainer, programContainer);

        if (this.first) {
            document.body.append(this.appContainer);
            this.first = false;
        }
    }
}

// add stuff to document
if (typeof getSetting(PROGRAMSELECT_ID)() === 'undefined') {
    saveSetting(PROGRAMSELECT_ID)(0);
}
ProgramContainer.renderProgram();