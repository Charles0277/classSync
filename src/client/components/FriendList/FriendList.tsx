import { IFriend } from '@/common/types/IUser';
import { getIdString } from '@/common/utils';
import React from 'react';
import trashIcon from '../../assets/trashIcon.svg';
import Button from '../Button/Button';
import styles from './FriendList.module.css';

interface FriendsListProps {
    friends: IFriend[];
    onRemoveFriend: (friendId: string) => void;
}

export const FriendList: React.FC<FriendsListProps> = ({
    friends,
    onRemoveFriend
}) => {
    return (
        <div className={styles.friendsList}>
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
                        onClick={() => onRemoveFriend(getIdString(friend._id))}
                    >
                        <img src={trashIcon} alt="Delete Friend" />
                    </Button>
                </div>
            ))}
        </div>
    );
};
