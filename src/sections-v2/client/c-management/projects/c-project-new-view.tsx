'use client';




import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import ProjectsTabsView from './c-projects-tabs-view';

// ----------------------------------------------------------------------

export default function ClientProjectNewView() {
    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <ProjectsTabsView />
        </Container>
    );
}
