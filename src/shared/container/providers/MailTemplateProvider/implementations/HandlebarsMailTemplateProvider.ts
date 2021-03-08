import IMailTemplateProvider from '../models/IMailTemplateProvider'
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

import handlebars from 'handlebars';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider{
    public async parse({ template, variables }: IParseMailTemplateDTO): Promise<string>{
        const parseTemplate = handlebars.compile(template);

        return parseTemplate(variables);
    }
}

export default HandlebarsMailTemplateProvider;
