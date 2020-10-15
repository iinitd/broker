import { useState, useEffect } from 'react';

type paramsModifier = (p: any) => any;

export function useBroker(broker: any) {
  const { initData, initParams, isPrefetch } = broker;

  const [data, setData] = useState(initData);
  const [params, setParams] = useState(initParams);
  const [loading, setLoading] = useState(false);

  const redeal = async (m?: paramsModifier) => {
    console.log('refetching');
    setLoading(true);
    let newParams = params;
    if (m) {
      newParams = m(params);
      setParams(newParams);
    }
    console.log('newParams', newParams);
    const res = await broker.deal(newParams);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isPrefetch) {
      redeal();
    }
  }, []);

  const exportables = {
    data,
    params,
    loading,
    redeal,
  };

  return exportables;
}

export class BaseBroker {
  public name?: string;
  public initData: any;
  public initParams: any;
  public isPrefetch: any;
  constructor(presets?: { name?: string; initData?: any; initParams: any; isPrefetch?: boolean }) {
    this.name = presets?.name;
    this.initData = presets?.initData;
    this.initParams = presets?.initParams;
    this.isPrefetch = presets?.isPrefetch || false;
  }
  public async deal(params: any): Promise<any> {}
}
