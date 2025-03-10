import { IFriend } from '@/common/types/IUser';
import { getIdString } from '@/common/utils';
import React, { useState } from 'react';
import trashIcon from '../../assets/trashIcon.svg';
import Button from '../Button/Button';
import styles from './FriendList.module.css';

interface FriendsListProps {
    friends: IFriend[];
    friendRequests: IFriend[];
    onRemoveFriend: (friendId: string) => void;
    onAcceptFriend: (friendId: string) => void;
    onDeclineFriend: (friendId: string) => void;
}

export const FriendList: React.FC<FriendsListProps> = ({
    friends,
    friendRequests,
    onRemoveFriend,
    onAcceptFriend,
    onDeclineFriend
}) => {
    const [selectedTab, setSelectedTab] = useState<
        'friends' | 'friendRequests'
    >('friends');

    return (
        <div className={styles.container}>
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tabButton} ${selectedTab === 'friends' ? styles.activeTab : ''}`}
                    onClick={() => setSelectedTab('friends')}
                >
                    Friends
                </button>
                <button
                    className={`${styles.tabButton} ${selectedTab === 'friendRequests' ? styles.activeTab : ''}`}
                    onClick={() => setSelectedTab('friendRequests')}
                >
                    Friend Requests
                </button>
            </div>

            <div className={styles.friendsContainer}>
                <div
                    className={styles.listsWrapper}
                    style={{
                        transform: `translateX(${selectedTab === 'friends' ? 0 : '-50%'})`
                    }}
                >
                    <div className={styles.list}>
                        {friends.map((friend) => (
                            <div
                                key={getIdString(friend._id)}
                                className={styles.friendItem}
                            >
                                <span className={styles.friendName}>
                                    {friend.firstName} {friend.lastName}
                                </span>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        onRemoveFriend(getIdString(friend._id))
                                    }
                                >
                                    <img src={trashIcon} alt="Delete Friend" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.list}>
                        {friendRequests.map((friend) => (
                            <div
                                key={getIdString(friend._id)}
                                className={styles.friendItem}
                            >
                                <span className={styles.friendName}>
                                    {friend.firstName} {friend.lastName}
                                </span>
                                <div className={styles.friendRequestsActions}>
                                    <Button
                                        type="button"
                                        className={styles.acceptButton}
                                        onClick={() =>
                                            onAcceptFriend(
                                                getIdString(friend._id)
                                            )
                                        }
                                    >
                                        ✓
                                    </Button>
                                    <Button
                                        type="button"
                                        className={styles.declineButton}
                                        onClick={() =>
                                            onDeclineFriend(
                                                getIdString(friend._id)
                                            )
                                        }
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
