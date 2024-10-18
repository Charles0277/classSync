import Card from '../../components/Card/Card';
import PageContainer from '../../components/Common/PageContainer/PageContainer';
import Panel from '../../components/Panels/Panel';

const Configuration = () => {
    return (
        <PageContainer>
            <Card title="Configurations" className="settingPanels">
                <Panel title="Rooms" rightSideControl="button"></Panel>
                <Panel
                    title="Days"
                    rightSideControl="input"
                    min={3}
                    max={7}
                ></Panel>
                <Panel
                    title="Hours"
                    rightSideControl="input"
                    min={5}
                    max={10}
                ></Panel>
            </Card>
        </PageContainer>
    );
};

export default Configuration;
