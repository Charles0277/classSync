import { IFriend } from '@/common/types/IUser';
import { getIdString } from '@/common/utils';
import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './FriendList.module.css';

interface FriendsListProps {
    friends: IFriend[];
    friendRequests: IFriend[];
    sentRequests: IFriend[];
    onRemoveFriend: (friendId: string) => void;
    onAcceptFriend: (friendId: string) => void;
    onDeclineFriend: (friendId: string) => void;
    onCancelFriendRequest: (friendId: string) => void;
}

export const FriendList: React.FC<FriendsListProps> = ({
    friends,
    friendRequests,
    sentRequests,
    onRemoveFriend,
    onAcceptFriend,
    onDeclineFriend,
    onCancelFriendRequest
}) => {
    const [selectedTab, setSelectedTab] = useState<
        'friends' | 'friendRequests' | 'sentRequests'
    >('friends');

    return (
        <div className={styles.container}>
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tabButton} ${selectedTab === 'friends' ? styles.activeTab : ''}`}
                    style={{ borderTopLeftRadius: '1rem' }}
                    onClick={() => setSelectedTab('friends')}
                >
                    Friends
                </button>
                <button
                    className={`${styles.tabButton} ${selectedTab === 'friendRequests' ? styles.activeTab : ''}`}
                    onClick={() => setSelectedTab('friendRequests')}
                >
                    Friend Requests
                    {friendRequests.length > 0 && (
                        <span className={styles.notificationBadge}>
                            {friendRequests.length}
                        </span>
                    )}
                </button>
                <button
                    className={`${styles.tabButton} ${selectedTab === 'sentRequests' ? styles.activeTab : ''}`}
                    onClick={() => setSelectedTab('sentRequests')}
                    style={{ borderTopRightRadius: '1rem' }}
                >
                    Sent Requests
                    {sentRequests.length > 0 && (
                        <span className={styles.notificationBadge}>
                            {sentRequests.length}
                        </span>
                    )}
                </button>
            </div>
            <div className={styles.friendsContainer}>
                <div
                    className={styles.listsWrapper}
                    style={{
                        transform: `translateX(${
                            selectedTab === 'friends'
                                ? 0
                                : selectedTab === 'friendRequests'
                                  ? '-33.33%'
                                  : '-66.66%'
                        })`
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
                                    className={'declineButton'}
                                    onClick={() =>
                                        onRemoveFriend(getIdString(friend._id))
                                    }
                                >
                                    ✕
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
                                        className={'declineButton'}
                                        onClick={() =>
                                            onDeclineFriend(
                                                getIdString(friend._id)
                                            )
                                        }
                                    >
                                        ✕
                                    </Button>
                                    <Button
                                        type="button"
                                        className={'acceptButton'}
                                        onClick={() =>
                                            onAcceptFriend(
                                                getIdString(friend._id)
                                            )
                                        }
                                    >
                                        ✓
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.list}>
                        {sentRequests.map((friend) => (
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
                                        className={'declineButton'}
                                        onClick={() =>
                                            onCancelFriendRequest(
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
