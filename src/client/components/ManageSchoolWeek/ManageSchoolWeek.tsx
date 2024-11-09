import { useEffect } from 'react';
import Panel from '../Panels/Panel';
import styles from './ManageSchoolWeek.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getConfigRequest } from '../../store/slices/schoolWeekConfigSlice';

interface PanelConfig {
    title: string;
    rightSideControl: 'input' | 'button';
    min?: number;
    max?: number;
}

const ManageSchoolWeek = () => {
    const { token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(getConfigRequest({ token }));
        }
    }, [token]);

    const panelConfigs: PanelConfig[] = [
        { title: 'Days per week', rightSideControl: 'input', min: 3, max: 7 },
        { title: 'Hours per day', rightSideControl: 'input', min: 5, max: 10 },
        { title: 'Start hour', rightSideControl: 'input', min: 6, max: 13 },
        { title: 'End hour', rightSideControl: 'input', min: 10, max: 19 }
    ];

    return (
        <div className={styles.schoolWeek}>
            {panelConfigs.map((config) => (
                <Panel
                    key={config.title}
                    title={config.title}
                    rightSideControl={config.rightSideControl}
                    min={config.min}
                    max={config.max}
                />
            ))}
        </div>
    );
};

export default ManageSchoolWeek;
