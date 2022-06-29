import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const get_rv_data = async () => {
    try {
        return await axios.get('https://www.rvusa.com/rv-guide/specs-by-type-class-b-t9');
    } catch (error) {
        console.log(error);
    }
}

const useData = async () => {
    const { data } = await get_rv_data();
    const $ = cheerio.load(data);
    const manufacturers = [];
    const mfrData = $('.spec-item');
    mfrData.each((i, el) => {
        const customers = { Manufacturer: '', Models: [] };
        customers.Manufacturer = ($(el).children('a').text());
        if (customers.Manufacturer) {
            $(el).children('div').each((j, elem) => {
                customers.Models.push(
                    $(elem)
                        .children('div')
                        .children('div').next()
                        .children()
                        .children().text()
                        .replace(/ *\([^)]*\) */g, ", ").split(','));
                return false;
            })
            customers.Models = customers.Models.flat().map((el) => el.trim()).filter((el) => el)
            manufacturers.push(customers);
        }
    })
    let rvData = JSON.stringify(manufacturers);
    fs.writeFileSync('test_rv_data.json', rvData);
}

useData();
