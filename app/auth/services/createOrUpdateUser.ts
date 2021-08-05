import db from "db";

type CreateUserArguments = {
  email: string;
  name: string;
  picture: string;
};

async function ensureOrganization(domain: string) {
  const existingOrganization = await db.organization.findUnique({
    where: { domain },
  });
  if (existingOrganization) {
    return existingOrganization;
  } else {
    return await db.organization.create({ data: { domain } });
  }
}

async function createOrUpdateUser({
  email,
  name,
  picture,
}: CreateUserArguments) {
  const [, domain] = email.split("@");
  const organization = await ensureOrganization(domain!);

  return await db.user.upsert({
    where: { email },
    create: {
      email,
      picture,
      name,
      organizationId: organization.id,
    },
    update: { email, name, picture },
  });
}

export default createOrUpdateUser;
