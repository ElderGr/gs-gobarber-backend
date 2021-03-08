import IMailTemplateProvider from '../models/IMailTemplateProvider'
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import fs from 'fs';

import handlebars from 'handlebars';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider{
    public async parse({ file, variables }: IParseMailTemplateDTO): Promise<string>{
        const templateFileContent = await fs.promises.readFile(file,{
            encoding: 'utf-8'
        })

        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}

export default HandlebarsMailTemplateProvider;
