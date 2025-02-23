import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import React from "react";
import CreateCredentialsDialog from "./_components/CreateCredentialsDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialsDialog from "./_components/DeleteCredentialsDialog";
import { Button } from "@/components/ui/button";

const CredentialsPage = () => {
  return (
    <div className="flex flex-1 h-full flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialsDialog />
      </div>
      <div className="h-full py-6 space-x-8">
        <Alert>
          <ShieldIcon className="w-4 h-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted,ensuring your data remains
            safe
          </AlertDescription>
        </Alert>
      </div>
      <UserCredentials />
    </div>
  );
};
const UserCredentials = async () => {
  const credentials = await GetCredentialsForUser();
  if (!credentials) {
    return <div>Something went wrong</div>;
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col text-center gap-2">
            <p className="font-bold">No credentials created yet</p>
            <p className="text-muted-foreground text-sm">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialsDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {credentials.map((credential) => {
        const createAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        });
        return (
          <Card
            key={credential.id}
            className="flex  p-4 w-full justify-between">
            <div className="flex gap-2 items-center">
              <div
                className="w-8 h-8 rounded-full flex justify-center items-center bg-primary/10
              ">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-muted-foreground text-xs">{createAt}</p>
              </div>
            </div>
            <DeleteCredentialsDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
};
export default CredentialsPage;
