'use client';

import React from 'react';

import UserCheckinMapView from '../app-user-checkin-map';

export default function AppCheckin({ id }: { id: string }) {
  return <UserCheckinMapView id={id} />;
}
