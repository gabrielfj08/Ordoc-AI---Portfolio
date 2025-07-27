import { CreateExternalRequesterAPIResponse } from '../../../services/flow-cidadao/types';
import { NewExternalRequesterFormValues } from '../types';

export interface NewRegistrationRequesterFormProps {
  onSubmit: (
    values: NewExternalRequesterFormValues
  ) => Promise<CreateExternalRequesterAPIResponse>;
}
