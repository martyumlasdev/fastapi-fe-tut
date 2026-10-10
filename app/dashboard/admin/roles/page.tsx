
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  assignPermission,
  getPermissions,
  getRoles,
  removePermission,
} from "@/lib/api";
import { Permission, Role } from "@/lib/types";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPermissionId, setSavingPermissionId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [loadedRoles, loadedPermissions] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      setRoles(loadedRoles);
      setPermissions(loadedPermissions);

      setSelectedRoleId((currentId) => {
        if (
          currentId !== null &&
          loadedRoles.some((role) => role.id === currentId)
        ) {
          return currentId;
        }

        return loadedRoles[0]?.id ?? null;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load RBAC data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  async function togglePermission(permission: Permission) {
    if (!selectedRole) return;

    const roleId = selectedRole.id;
    const alreadyAssigned = selectedRole.permissions.some(
      (item) => item.id === permission.id,
    );

    setSavingPermissionId(permission.id);
    setError("");
    setSuccess("");

    try {
      if (alreadyAssigned) {
        await removePermission(roleId, permission.id);
      } else {
        await assignPermission(roleId, permission.id);
      }

      setRoles((currentRoles) =>
        currentRoles.map((role) => {
          if (role.id !== roleId) return role;

          return {
            ...role,
            permissions: alreadyAssigned
              ? role.permissions.filter(
                  (item) => item.id !== permission.id,
                )
              : [...role.permissions, permission].sort((a, b) =>
                  a.name.localeCompare(b.name),
                ),
          };
        }),
      );

      setSuccess(
        alreadyAssigned
          ? `${permission.name} removed from ${selectedRole.name}.`
          : `${permission.name} assigned to ${selectedRole.name}.`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to update the permission.",
      );
    } finally {
      setSavingPermissionId(null);
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Loading roles and permissions...</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Roles & Permissions
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage which actions each role is allowed to perform.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      {roles.length === 0 ? (
        <p className="rounded-lg border border-gray-200 p-6 text-gray-600">
          No roles found.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 font-semibold text-gray-900">Roles</h2>

            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setError("");
                    setSuccess("");
                  }}
                  className={`w-full rounded-md px-3 py-3 text-left ${
                    selectedRoleId === role.id
                      ? "bg-blue-50 text-blue-800 ring-1 ring-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="block font-medium">{role.name}</span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {role.permissions.length} permissions
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
            {selectedRole && (
              <>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedRole.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedRole.description || "No description provided."}
                  </p>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-gray-900">
                    Available permissions
                  </h3>
                  <span className="text-sm text-gray-500">
                    {selectedRole.permissions.length} of {permissions.length}{" "}
                    assigned
                  </span>
                </div>

                <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {permissions.map((permission) => {
                    const checked = selectedRole.permissions.some(
                      (item) => item.id === permission.id,
                    );

                    return (
                      <label
                        key={permission.id}
                        className="flex cursor-pointer items-start gap-3 p-4 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={savingPermissionId !== null}
                          onChange={() => void togglePermission(permission)}
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />

                        <span className="min-w-0 flex-1">
                          <span className="block break-all font-medium text-gray-900">
                            {permission.name}
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            {permission.description || "No description"}
                          </span>
                        </span>

                        {savingPermissionId === permission.id && (
                          <span className="text-xs text-gray-500">
                            Saving...
                          </span>
                        )}
                      </label>
                    );
                  })}

                  {permissions.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">
                      No permissions found.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
