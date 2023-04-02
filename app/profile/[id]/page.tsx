'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { client, getProfile, getPublications } from '../../../api';

export default function Profile() {
  const [profile, setProfile] = useState<any>();
  const [publications, setPublications] = useState<any>([]);

  const pathName = usePathname();
  const handle = pathName?.split('/')[2];

  useEffect(() => {
    if (handle) {
      fetchProfile();
    }
  }, [handle]);

  async function fetchProfile() {
    try {
      //profile
      const returnedProfile = await client.query({
        query: getProfile,
        variables: { handle },
      });
      const profileData = { ...returnedProfile.data.profile };

      const picture = profileData.picture;
      if (picture && picture.original && picture.original.url) {
        if (picture.original.url.startsWith('ipfs://')) {
          let result = picture.original.url.substring(7, picture.original.url.length);
          profileData.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
        } else {
          profileData.avatarUrl = profileData.picture.original.url;
        }
      }
      setProfile(profileData);

      //publications
      const pubs = await client.query({
        query: getPublications,
        variables: {
          id: profileData.id,
          limit: 50,
        },
      });
      setPublications(pubs.data.publications.items);

      // catch errors
    } catch (err) {
      console.log({ err });
    }
  }

  if (!profile) return null;

  return (
    
    <div className="pt-20">
      
      {/* profile */}
      <div className="flex flex-col justify-center items-center">
        <img className="w-64 rounded" src={profile.avatarUrl} />
        <p className="text-4xl mt-8 mb-8">{profile.handle}</p>
        <p className="text-center text-xl font-bold mt-2 mb-2 w-1/2">{profile.bio}</p>
      </div>

      {/* //publications */}
      {publications.map((pub) => (
        <div key={pub.id} className="p-10">
          <p>{pub.metadata.content}</p>
        </div>
      ))}
    </div>
  );
}
