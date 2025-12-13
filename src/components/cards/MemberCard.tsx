/**
 * MemberCard Component
 *
 * Display member information in a card format
 */

'use client';

import React from 'react';
import { Avatar } from 'primereact/avatar';
import { CardDiv } from './CardDiv';
import { formatDate } from '@/core/date-utils';
import type { MemberDto } from '@/models/member.types';

export interface MemberCardProps {
  /** Member data */
  member: MemberDto;
  /** Show detailed info */
  detailed?: boolean;
  /** Show actions */
  showActions?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Edit handler */
  onEdit?: () => void;
  /** Delete handler */
  onDelete?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function MemberCard({
  member,
  detailed = false,
  showActions = false,
  selected = false,
  onClick,
  onEdit,
  onDelete,
  className = '',
}: MemberCardProps) {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name?.charAt(0) || ''}${member.last_name?.charAt(0) || ''}`;

  return (
    <CardDiv
      className={`${className} ${selected ? 'ring-2 ring-primary' : ''}`}
      hover={!!onClick}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar
          image={member.photo || undefined}
          label={!member.photo ? initials : undefined}
          size="large"
          shape="circle"
          className="bg-primary text-white flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{fullName}</h4>

          {member.email && (
            <p className="text-sm text-gray-500 truncate">
              <i className="pi pi-envelope mr-1" style={{ fontSize: '0.75rem' }} />
              {member.email}
            </p>
          )}

          {member.mobile_number && (
            <p className="text-sm text-gray-500">
              <i className="pi pi-phone mr-1" style={{ fontSize: '0.75rem' }} />
              {member.mobile_number}
            </p>
          )}

          {detailed && (
            <>
              {member.gender && (
                <p className="text-sm text-gray-500 mt-1">
                  <i className="pi pi-user mr-1" style={{ fontSize: '0.75rem' }} />
                  {member.gender}
                </p>
              )}

              {member.birthdate && (
                <p className="text-sm text-gray-500">
                  <i className="pi pi-calendar mr-1" style={{ fontSize: '0.75rem' }} />
                  {formatDate(member.birthdate)}
                </p>
              )}

              {member.address && (
                <p className="text-sm text-gray-500 mt-1 truncate">
                  <i className="pi pi-map-marker mr-1" style={{ fontSize: '0.75rem' }} />
                  {member.address}
                </p>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                title="Edit"
              >
                <i className="pi pi-pencil" style={{ fontSize: '0.875rem' }} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                title="Delete"
              >
                <i className="pi pi-trash" style={{ fontSize: '0.875rem' }} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status badges */}
      {detailed && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          {member.cell_group && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
              Cell: {member.cell_group.name}
            </span>
          )}
          {member.affiliation && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              {member.affiliation}
            </span>
          )}
        </div>
      )}
    </CardDiv>
  );
}

/**
 * Member List Item - Compact version for lists
 */
export function MemberListItem({
  member,
  onClick,
  selected,
  className = '',
}: {
  member: MemberDto;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name?.charAt(0) || ''}${member.last_name?.charAt(0) || ''}`;

  return (
    <div
      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors ${
        selected ? 'bg-primary/5 border border-primary/20' : ''
      } ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <Avatar
        image={member.photo || undefined}
        label={!member.photo ? initials : undefined}
        size="normal"
        shape="circle"
        className="bg-primary text-white"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{fullName}</p>
        <p className="text-sm text-gray-500 truncate">
          {member.email || member.mobile_number || 'No contact info'}
        </p>
      </div>
      {selected && <i className="pi pi-check text-primary" />}
    </div>
  );
}

export default MemberCard;
