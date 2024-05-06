'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


/*
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
};
*/

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const ClientInvoiceDataSchema = FormSchema.omit({id: true, date: true});
const UpdateInvoiceDataSchema = FormSchema.omit({ id: true, date: true });

export type State = {
	errors?: {
		customerId?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
	// const rawFormData = Object.fromEntries(formData.entries()); // next adds its own hidden ACTION_ID parameter
	// console.log(rawFormData);
	// const { customerId, amount, status } = ClientInvoiceDataSchema.parse(rawFormData);
	
	const validatedFields = ClientInvoiceDataSchema.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	  });
	  
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		};
	}
	  
	console.log(validatedFields);
	const {customerId, amount, status} = validatedFields.data;	
	
	// guaranteed to be at most two digits after the decimal point due to the step attribute in the input
	const amountInCents = amount*100;
	
	const invoiceDate = new Date().toISOString().split("T")[0]; // yields YYYY-MM-DD from a string that originally was YYYY-MM-DDT<hour>
	
	// console.log("sql\`" + `INSERT INTO invoices (customer_id, amount, status, date) values (${customerId}, ${amountInCents}, ${status}, ${invoiceDate});` + "\`");
	try {
		await sql`INSERT INTO invoices (customer_id, amount, status, date) values (${customerId}, ${amountInCents}, ${status}, ${invoiceDate});`;
	} catch (error) {
		return { message: "Database error: Failed to create invoice" /*, error: error */};
	}
	
	revalidatePath("/dashboard/invoices/");
	redirect("/dashboard/invoices/");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoiceDataSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
	// obviously, can't return because anything after the redirect is unreachable
}

export async function deleteInvoice(id: string) {
	throw new Error("...");

	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`;
		revalidatePath('/dashboard/invoices');
		return { message: "Succesfully deleted invoice" };
	} catch (error) {
		return { message: "Database error: Failed to delete invoice" /*, error: error */};
	}
}

export async function authenticate(prevState: string|undefined, formData: FormData) {
  try {
    await signIn('credentials', formData); // I guess this goes to auth.ts?
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}