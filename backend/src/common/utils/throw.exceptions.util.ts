import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Model, ModelCtor } from 'sequelize-typescript';
import { Exception } from '../interface/exception.interface';
/**
 * Throw a NotFoundException if the record does not exist
 *
 * @param model A Sequelize model
 * @param params A set of parameters to search for in the model
 * @throws NotFoundException If the record does not exist
 */
export const RecordNotFoundException = async <T extends Model>(
  model: ModelCtor<T>,
  params: any,
  message?: string,
): Promise<void> => {
  const record = await model.findOne({
    where: { ...params },
  });
  if (!record) {
    const exception: Exception = {
      errors: [
        {
          message: message,
        },
      ],
    };
    throw new NotFoundException(exception);
  }
};
/**
 * @param model A Sequelize model
 * @param params A set of parameters to search for in the model
 * @throws ConflictException If the record already exists
 */
export const RecordDuplicateException = async <T extends Model>(
  model: ModelCtor<T>,
  params: any,
  message?: string,
) => {
  const record = await model.findOne({
    where: { ...params },
  });
  if (record != null) {
    const exception: Exception = {
      errors: [{ message: message || 'Duplicate record found' }],
    };

    throw new ConflictException(exception);
  }
};

export const throwConflictExceptionWithMessage = (message: string) => {
  const exception: Exception = {
    message: message,
    errors: [{ message: message }],
  };

  throw new ConflictException(exception);
};
