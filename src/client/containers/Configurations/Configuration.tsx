import Card from '../../components/Card/Card';
import PageContainer from '../../components/Common/PageContainer/PageContainer';
import Panel from '../../components/Panels/Panel';

const Configuration = () => {
    return (
        <PageContainer>
            <Card title="Configurations" className="settingPanels">
                <Panel title="Users" rightSideControl="button"></Panel>
                <Panel title="Rooms" rightSideControl="button"></Panel>
                <Panel title="School Week" rightSideControl="button"></Panel>
                <Panel title="Courses" rightSideControl="button"></Panel>
                <Panel title="Course Units" rightSideControl="button"></Panel>
            </Card>
        </PageContainer>
    );
};

export default Configuration;
