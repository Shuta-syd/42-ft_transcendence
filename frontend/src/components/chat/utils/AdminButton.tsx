import React from "react";
import axios from "axios";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomMenu from "../../utils/CustomMenu";

type AdminButtonProps = {
  roomId: string;
  memberRole: string;
  member: any;
  myRole: string;
  members: any;
  setMembers: any
}

export default function AdminButton(props: AdminButtonProps) {
  const { roomId, myRole, memberRole, member, members, setMembers } = props;

  const handleKick = async (memberId: string) => {
    try {
      await axios.delete(`http://localhost:8080/chat/channel/member/kick`, { data: { roomId, memberId} })
      const newMembers = members.filter((val: { id: string; }) => val.id !== memberId);
      setMembers(newMembers);
    } catch (error) {
      alert('権限がないもしくは他の理由でKICKに失敗しました');
    }
  }

  const handleBan = async (memberId: string) => {
    try {
      await axios.post(`http://localhost:8080/chat/channel/member/ban`, { roomId, memberId });
      const newMembers = members.filter((val: { id: string; }) => val.id !== memberId);
      setMembers(newMembers);
    } catch (error) {
      alert('権限がないもしくは他の理由でBANに失敗しました')
    }
  }

  const handleMute = async (memberId: string, isMute: boolean) => {
    try {
      await axios.patch(`http://localhost:8080/chat/channel/member/mute`, { roomId, memberId, isMute: !isMute });
      setMembers((prev: any[]) => prev.map((val: { id: string; }) => {
        if (val.id === memberId)
          return { ...val, isMute: !isMute };
        return val;
      }))
    } catch (error) {
      alert('権限がないもしくは他の理由でミュートに失敗しました');
    }
  }

  const handleGiveAdmin = async (memberId: string) => {
    try {
      await axios.post(`http://localhost:8080/chat/channel/role`, { roomId, memberId });
      setMembers((prev: any[]) => prev.map((val: { id: string; role: string; }) => {
        if (val.id === memberId) {
          return val.role === 'ADMIN' ? { ...val, role: 'NORMAL' } : { ...val, role: 'ADMIN' };
        }
        return val;
      }))
    } catch (error) {
      console.log(error);
      alert('権限がないもしくはすでにオーナーです');
    }
  }

  if (myRole === 'NORMAL' || myRole === '') {
    return (<></>);
  }

  if (myRole === 'ADMIN') {
    return (
      <>
      {memberRole === 'NORMAL' ? (
        <CustomMenu
        ButtonIcon={<MoreVertIcon />}
        menuItems={[
          { name: member.isMute ? 'unMute' : 'Mute', handleOnClick: async () => { await handleMute(member.id, member.isMute) } },
          { name: 'Kick', handleOnClick: async () => { await handleKick(member.id) } },
          { name: 'Ban',  handleOnClick: async () => { await handleBan(member.id) } }
        ]}
        />
        ) : (<></>)}
      </>
    )
  }

  return (
    <>
      {memberRole === 'NORMAL' || memberRole === 'ADMIN' ? (
        <CustomMenu
          ButtonIcon={<MoreVertIcon />}
          menuItems={[
          { name: member.role === 'NORMAL' ? 'Give Admin' : 'Revoke Admin', handleOnClick: async () => { await handleGiveAdmin(member.id); } },
          { name: member.isMute ? 'unMute' : 'Mute', handleOnClick: async () => { await handleMute(member.id, member.isMute) } },
          { name: 'Kick', handleOnClick: async () => { await handleKick(member.id) } },
          { name: 'Ban',  handleOnClick: async () => { await handleBan(member.id) } }
        ]}
        />
        ) : (<></>)}
    </>
  )
}
