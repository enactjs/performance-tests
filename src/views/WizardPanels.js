import kind from '@enact/core/kind';
import BodyText from "@enact/sandstone/BodyText";
import Button from "@enact/sandstone/Button";
import Scroller from "@enact/sandstone/Scroller";
import WizardPanels from '@enact/sandstone/WizardPanels';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const WizardPanelsView = kind({
	name: 'WizardPanelView',

	render: () => (
		<Profiler id="wizardPanel-rendered" onRender={putRenderedMark}>
		<WizardPanels id="wizardPanels">
			<WizardPanels.Panel
				footer="Footer in View 1"
				subtitle="A subtitle for View 1"
				title="WizardPanel View 1"
				prevButton={<Button icon="arrowlargeleft" id="prevButton" aria-label="exit" />}
				nextButton={<Button icon="arrowlargeright" id="nextButton" aria-label="exit" />}
			>
				<Scroller>
					<BodyText>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
						ut labore et dolore magna aliqua. Purus faucibus ornare suspendisse sed nisi. Vestibulum
						sed arcu non odio euismod lacinia at quis. Elementum eu facilisis sed odio morbi quis
						commodo. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Neque
						ornare aenean euismod elementum. Iaculis nunc sed augue lacus viverra vitae congue eu
						consequat. Vulputate eu scelerisque felis imperdiet proin fermentum leo vel orci.
						Tincidunt augue interdum velit euismod. Nunc sed augue lacus viverra vitae congue eu
						consequat. Ultricies integer quis auctor elit sed vulputate. Pellentesque adipiscing
						commodo elit at imperdiet dui accumsan sit. Elit sed vulputate mi sit amet mauris commodo.
						Ipsum consequat nisl vel pretium lectus. Sed ullamcorper morbi tincidunt ornare massa eget
						egestas. Nulla facilisi morbi tempus iaculis urna id volutpat. Facilisis magna etiam
						tempor orci eu lobortis elementum nibh tellus. Lorem ipsum dolor sit amet, consectetur
						adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus
						faucibus ornare suspendisse sed nisi. Vestibulum sed arcu non odio euismod lacinia at
						quis. Elementum eu facilisis sed odio morbi quis commodo. Scelerisque mauris pellentesque
						pulvinar pellentesque habitant morbi. Neque ornare aenean euismod elementum. Iaculis nunc
						sed augue lacus viverra vitae congue eu consequat. Vulputate eu scelerisque felis
						imperdiet proin fermentum leo vel orci. Tincidunt augue interdum velit euismod. Nunc sed
						augue lacus viverra vitae congue eu consequat. Ultricies integer quis auctor elit sed
						vulputate. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Elit sed
						vulputate mi sit amet mauris commodo. Ipsum consequat nisl vel pretium lectus. Sed
						ullamcorper morbi tincidunt ornare massa eget egestas. Nulla facilisi morbi tempus iaculis
						urna id volutpat. Facilisis magna etiam tempor orci eu lobortis elementum nibh
						tellus.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Purus faucibus ornare suspendisse sed nisi.
						Vestibulum sed arcu non odio euismod lacinia at quis. Elementum eu facilisis sed odio
						morbi quis commodo. Scelerisque mauris pellentesque pulvinar pellentesque habitant morbi.
						Neque ornare aenean euismod elementum. Iaculis nunc sed augue lacus viverra vitae congue
						eu consequat. Vulputate eu scelerisque felis imperdiet proin fermentum leo vel orci.
						Tincidunt augue interdum velit euismod. Nunc sed augue lacus viverra vitae congue eu
						consequat. Ultricies integer quis auctor elit sed vulputate. Pellentesque adipiscing
						commodo elit at imperdiet dui accumsan sit. Elit sed vulputate mi sit amet mauris commodo.
						Ipsum consequat nisl vel pretium lectus. Sed ullamcorper morbi tincidunt ornare massa eget
						egestas. Nulla facilisi morbi tempus iaculis urna id volutpat. Facilisis magna etiam
						tempor orci eu lobortis elementum nibh tellus. Lorem ipsum dolor sit amet, consectetur
						adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus
						faucibus ornare suspendisse sed nisi. Vestibulum sed arcu non odio euismod lacinia at
						quis. Elementum eu facilisis sed odio morbi quis commodo. Scelerisque mauris pellentesque
						pulvinar pellentesque habitant morbi. Neque ornare aenean euismod elementum. Iaculis nunc
						sed augue lacus viverra vitae congue eu consequat. Vulputate eu scelerisque felis
						imperdiet proin fermentum leo vel orci. Tincidunt augue interdum velit euismod. Nunc sed
						augue lacus viverra vitae congue eu consequat. Ultricies integer quis auctor elit sed
						vulputate. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Elit sed
						vulputate mi sit amet mauris commodo. Ipsum consequat nisl vel pretium lectus. Sed
						ullamcorper morbi tincidunt ornare massa eget egestas. Nulla facilisi morbi tempus iaculis
						urna id volutpat. Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus.
					</BodyText>
				</Scroller>
				<footer>
					<Button>OK</Button>
					<Button>Cancel</Button>
				</footer>
			</WizardPanels.Panel>
			<WizardPanels.Panel
				subtitle="A subtitle for View 2 that is really, really way too long for its own good. In fact, it's so long that it probably goes to multiple lines, unless your screen is so large that it somehow fits.    That seems unlikely, though, unless you're in the year 2030 or something."
				title="WizardPanel View 2"
			>
				<BodyText>Several buttons!</BodyText>
				<Button icon="list">Button A</Button>
				<Button icon="gear">Button B</Button>
				<Button icon="search">Button C</Button>
				<Button icon="lock">Button D</Button>
				<footer>
					<Button>OK</Button>
				</footer>
			</WizardPanels.Panel>
		</WizardPanels>
		</Profiler>
	)
});

export default WizardPanelsView;
