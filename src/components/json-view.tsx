import JsonView from '@uiw/react-json-view';
import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { useTheme } from './theme-provider';

export default function JsonViewComponent({ value }: { value: any }) {

    const { theme } = useTheme();



    return (
        <JsonView
            value={((value: string) => {
                try {
                    return JSON.parse(value)
                } catch {
                    return {};
                }
            })(value)}
            style={theme == "dark" ? vscodeTheme : githubLightTheme}
            enableClipboard={true}
            displayDataTypes={false}
            className='h-full'
        >
            <JsonView.Arrow>
                <TriangleSolidArrow />
            </JsonView.Arrow>
        </JsonView>
    )
}