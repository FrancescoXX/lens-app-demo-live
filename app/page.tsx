'use client';
import { useEffect, useState } from 'react';
import { client, exploreProfiles } from '../api';
import Link from 'next/link';

export default function Home() {
  const [profiles, setProfiles] = useState<any>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      let response = await client.query({ query: exploreProfiles });

      let profileData = await Promise.all(
        response.data.exploreProfiles.items.map(async (profileInfo) => {
          let profile = { ...profileInfo };
          let picture = profile.picture;
          if (picture && picture.original && picture.original.url) {
            if (picture.original.url.startsWith('ipfs://')) {
              let result = picture.original.url.substring(7, picture.original.url.length);
              profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
            } else {
              profile.avatarUrl = picture.original.url;
            }
          }
          return profile;
        })
      );

      setProfiles(profileData);
    } catch (err) {
      console.log({ err });
    }
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap">
        {profiles.map((profile) => (
          <div key={profile.id} className="w-1/5 p-3 mb-2 rounded flex flex-col items-center">
            <img className="w-48 rounded" src={profile.avatarUrl} />
            <p className="font-bold text-xl text-center mt-4 line-clamp-1">{profile.name}</p>
            <Link href={`/profile/${profile.handle}`}>
              <p className="cursor-pointer text-lime-500 text-lg font-medium text-center mt-2 mb-2">{profile.handle}</p>
            </Link>
            <p className="text-sm font-medium text-center">{profile.stats.totalFollowers} followers</p>
          </div>
        ))}
      </div>
    </div>
  );
}
